using Server.Infrastructure;
using Core;
using Core.Enums;
using Core.Database.Entities;
using Core.Database;
using Microsoft.OpenApi;
using Microsoft.EntityFrameworkCore;

namespace Server;

public class ExerciseDbMigrationService(IServiceScopeFactory serviceScopeFactory, IExerciseDbClient exerciseDbClient, ILogger<ExerciseDbMigrationService> logger)
{
    public static readonly HashSet<string> _blockedExerciseIds = ["0004", "0008"];
    private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
    private readonly ILogger<ExerciseDbMigrationService> _logger = logger;

    public async Task CollectExercisesAsync()
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var existingExerciseIds = await db.Exercises.Select(e => e.Id).ToHashSetAsync();
        var startingIndex = existingExerciseIds.Count > 0 ? existingExerciseIds.Max(int.Parse) : 0;
        for (int i = startingIndex; i < 1000; i++)
        {
            string exerciseId = $"{i + 1:D4}";
            if (existingExerciseIds.Contains(exerciseId))
            {
                _logger.LogInformation("Exercise with ID {ExerciseId} already exists in the database. Skipping.", exerciseId);
                continue;
            }
            if(_blockedExerciseIds.Contains(exerciseId))
            {
                _logger.LogInformation("Exercise with ID {ExerciseId} is currently blocked due to previous API errors. Skipping.", exerciseId);
                continue;
            }
            ExerciseResponse? exerciseData = null;
            try
            {
                exerciseData = await exerciseDbClient.GetExerciseAsync(exerciseId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch exercise with ID {ExerciseId}", exerciseId);
                _blockedExerciseIds.Add(exerciseId);
                await Task.Delay(4_000); // wait 10 seconds before the next request to avoid hitting API rate limits
                continue;
            }

            try
            {
                var currentTarget = await db.Muscles.FirstOrDefaultAsync(m => m.Name == exerciseData.Target);
                var currentBodyPart = await db.BodyParts.FirstOrDefaultAsync(bp => bp.Name == exerciseData.BodyPart);
                var currentEquipment = await db.Equipment.FirstOrDefaultAsync(eq => eq.Name == exerciseData.Equipment);

                // Handle new BodyPart
                if (currentBodyPart == null)
                {
                    currentBodyPart = new BodyPart { Name = exerciseData.BodyPart };
                    db.BodyParts.Add(currentBodyPart);
                }

                // Handle new Equipment
                if (currentEquipment == null)
                {
                    currentEquipment = new Equipment { Name = exerciseData.Equipment };
                    db.Equipment.Add(currentEquipment);
                }

                // Save to get IDs for BodyPart and Equipment
                await db.SaveChangesAsync();

                // Handle new Target Muscle (now we have BodyPartId)
                if (currentTarget == null)
                {
                    currentTarget = new Muscle { Name = exerciseData.Target, BodyPartId = currentBodyPart.Id };
                    db.Muscles.Add(currentTarget);
                }

                // Handle secondary muscles - add any that don't exist
                var existingSecondaryMuscles = await db.Muscles.Where(m => exerciseData.SecondaryMuscles.Contains(m.Name)).ToListAsync();
                var existingSecondaryMuscleNames = existingSecondaryMuscles.Select(m => m.Name).ToHashSet();

                var newSecondaryMuscles = exerciseData.SecondaryMuscles
                    .Where(name => !existingSecondaryMuscleNames.Contains(name))
                    .Select(name => new Muscle { Name = name, BodyPartId = currentBodyPart.Id })
                    .ToList();

                if (newSecondaryMuscles.Count != 0)
                {
                    db.Muscles.AddRange(newSecondaryMuscles);
                }

                // Save all muscles
                await db.SaveChangesAsync();

                // Get all secondary muscles (existing + newly added)
                var secondaryMuscles = await db.Muscles.Where(m => exerciseData.SecondaryMuscles.Contains(m.Name)).ToListAsync();

                var exercise = new Exercise
                {
                    Id = exerciseData.Id,
                    Name = exerciseData.Name,
                    Description = exerciseData.Description,
                    Difficulty = Enum.Parse<ExerciseDifficulty>(exerciseData.Difficulty, ignoreCase: true),
                    Category = Enum.Parse<ExerciseCategory>(exerciseData.Category, ignoreCase: true),
                    BodyPartId = currentBodyPart.Id,
                    EquipmentId = currentEquipment.Id,
                    TargetMuscleId = currentTarget.Id,
                    Instructions = FormatInstructions(exerciseData.Instructions),
                    SecondaryMuscles = secondaryMuscles
                };

                db.Exercises.Add(exercise);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while saving to the db");
                break;
            }
            await Task.Delay(4_000); // wait 10 seconds before the next request to avoid hitting API rate limits
        }
    }

    public static string FormatInstructions(string[] instructions)
    {
        return string.Join("\n", instructions.Select((instruction, index) => $"{index + 1}. {instruction}"));
    }
}
