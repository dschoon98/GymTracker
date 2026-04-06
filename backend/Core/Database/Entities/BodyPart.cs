namespace Core.Database.Entities;

public class BodyPart
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public ICollection<Exercise> Exercises { get; set; } = [];
    public ICollection<Muscle> Muscles { get; set; } = [];
}
