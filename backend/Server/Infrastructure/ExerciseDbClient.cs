namespace Server.Infrastructure;

public interface IExerciseDbClient
{
    Task<ExerciseResponse> GetExerciseAsync(string exerciseId);
    Task GetImageAsync(string exerciseId, int resolution = 360);
}

public class ExerciseResponse
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Target { get; set; } = null!;
    public string Difficulty { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string BodyPart { get; set; } = null!;
    public string Equipment { get; set; } = null!;
    public string[] Instructions { get; set; } = null!;
    public string[] SecondaryMuscles { get; set; } = [];
}

public class ExerciseDbClient(HttpClient httpClient) : IExerciseDbClient
{
    private readonly HttpClient _httpClient = httpClient;

    public async Task<ExerciseResponse> GetExerciseAsync(string exerciseId)
    {
        string requestUri = $"exercises/exercise/{exerciseId}";
        var response = await _httpClient.GetAsync(requestUri);
        response.EnsureSuccessStatusCode();
        var exerciseData = await response.Content.ReadFromJsonAsync<ExerciseResponse>();
        return exerciseData!;
    }

    public async Task GetImageAsync(string exerciseId, int resolution = 360)
    {
        string gifsPath = Environment.GetEnvironmentVariable("GIFS_PATH") ?? throw new InvalidOperationException("GIFS_PATH environment variable is not set.");
        string filePath = Path.Combine(gifsPath, $"{exerciseId}.gif");
        if (File.Exists(filePath))
            return;

        string requestUri = $"image?resolution={resolution}&exerciseId={exerciseId}";
        var response = await _httpClient.GetAsync(requestUri);
        response.EnsureSuccessStatusCode();
        var imageData = await response.Content.ReadAsByteArrayAsync();
        var dir = Path.GetDirectoryName(filePath);
        if (!string.IsNullOrEmpty(dir))
        {
            Directory.CreateDirectory(dir);
        }
        await File.WriteAllBytesAsync(filePath, imageData);
    }
}
