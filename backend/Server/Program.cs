using Core.Database;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Server;
using Server.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLogging();

builder.Services.AddSingleton<ExerciseDbMigrationService>();

// DB Context
var connectionString = builder.Configuration.GetConnectionString("Db")!;
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
var dataSource = dataSourceBuilder.Build();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(dataSource, o =>
    {
        o.MigrationsHistoryTable("__appDb_efMigrationsHistory");
        o.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorCodesToAdd: null);
    }).UseSnakeCaseNamingConvention();
});

builder.Services.AddHttpClient<IExerciseDbClient, ExerciseDbClient>(options =>
{
    var baseUrl = "https://exercisedb.p.rapidapi.com";
    options.BaseAddress = new Uri(baseUrl);
    options.DefaultRequestHeaders.Add("X-RapidAPI-Key", builder.Configuration["RapidApiKey"]!);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var migrationService = app.Services.GetRequiredService<ExerciseDbMigrationService>();   
await migrationService.CollectExercisesAsync();

app.Run();
