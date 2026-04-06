namespace Core.Database.Entities;

public class Equipment
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public ICollection<Exercise> Exercises { get; set; } = [];
}
