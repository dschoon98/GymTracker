using Core.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Core.Database;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Exercise> Exercises { get; set; } = null!;
    public virtual DbSet<Muscle> Muscles { get; set; } = null!;
    public virtual DbSet<BodyPart> BodyParts { get; set; } = null!;
    public virtual DbSet<Equipment> Equipment { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureExercise(modelBuilder);
        ConfigureMuscle(modelBuilder);
        ConfigureBodyPart(modelBuilder);
        ConfigureEquipment(modelBuilder);

        OnModelCreatingPartial(modelBuilder);
    }

    private static void ConfigureExercise(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(36);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Description);
            entity.Property(e => e.Instructions);
            entity.Property(e => e.Difficulty).HasConversion<byte>();
            entity.Property(e => e.Category).HasConversion<byte>();

            // FK: Exercise -> BodyPart
            entity.HasOne(e => e.BodyPart)
                .WithMany(bp => bp.Exercises)
                .HasForeignKey(e => e.BodyPartId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            // FK: Exercise -> Equipment
            entity.HasOne(e => e.Equipment)
                .WithMany(eq => eq.Exercises)
                .HasForeignKey(e => e.EquipmentId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            // FK: Exercise -> Muscle (Target)
            entity.HasOne(e => e.Target)
                .WithMany(m => m.Exercises)
                .HasForeignKey(e => e.TargetMuscleId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            // Many-to-Many: Exercise -> SecondaryMuscles
            entity.HasMany(e => e.SecondaryMuscles)
                .WithMany()
                .UsingEntity("ExerciseSecondaryMuscle", 
                    l => l.HasOne(typeof(Muscle)).WithMany().HasForeignKey("SecondaryMuscleId").OnDelete(DeleteBehavior.Cascade),
                    r => r.HasOne(typeof(Exercise)).WithMany().HasForeignKey("ExerciseId").OnDelete(DeleteBehavior.Cascade));
        });
    }

    private static void ConfigureMuscle(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Muscle>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.Name).HasMaxLength(255);

            // FK: Muscle -> BodyPart
            entity.HasOne(m => m.BodyPart)
                .WithMany(bp => bp.Muscles)
                .HasForeignKey(m => m.BodyPartId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureBodyPart(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BodyPart>(entity =>
        {
            entity.HasKey(bp => bp.Id);
            entity.Property(bp => bp.Name).HasMaxLength(255);
        });
    }

    private static void ConfigureEquipment(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Equipment>(entity =>
        {
            entity.HasKey(eq => eq.Id);
            entity.Property(eq => eq.Name).HasMaxLength(255);
        });
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // This is a fallback for design-time tools (migrations, scaffolding)
        // when the context is created without dependency injection
        if (!optionsBuilder.IsConfigured)
        {
            var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__Db");
            if (!string.IsNullOrEmpty(connectionString))
            {
                // Create a properly configured data source for design-time scenarios
                var dataSourceBuilder = new Npgsql.NpgsqlDataSourceBuilder(connectionString);
                dataSourceBuilder.UseNetTopologySuite();
                // Enable dynamic JSON serialization for JSONB columns (e.g., AdditionalCostsDto)
                dataSourceBuilder.EnableDynamicJson();
                var dataSource = dataSourceBuilder.Build();

                optionsBuilder.UseNpgsql(dataSource, o =>
                {
                    o.MigrationsHistoryTable("__appDb_efMigrationsHistory").UseNetTopologySuite();
                }).UseSnakeCaseNamingConvention();
            }
        }
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
