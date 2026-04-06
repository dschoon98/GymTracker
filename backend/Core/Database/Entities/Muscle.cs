namespace Core.Database.Entities;

public class Muscle
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int BodyPartId { get; set; }
    public BodyPart BodyPart { get; set; } = null!;
    public ICollection<Exercise> Exercises { get; set; } = [];
}
