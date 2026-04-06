using Core.Enums;

namespace Core.Database.Entities;

public class Exercise
{
    public string Id { get; set; } = null!;
    public int EquipmentId { get; set; }
    public int BodyPartId { get; set; }
    public int TargetMuscleId { get; set; }
    public required string Name { get; set; } = null!;
    public required string Instructions { get; set; } = null!;
    public required string Description { get; set; } = null!;
    public ExerciseDifficulty Difficulty { get; set; }
    public ExerciseCategory Category { get; set; }
    public BodyPart BodyPart { get; set; } = null!;
    public Equipment Equipment { get; set; } = null!;
    public Muscle Target { get; set; } = null!;
    public ICollection<Muscle> SecondaryMuscles { get; set; } = [];
}
