using ApexDigital.Domain.Entities;
using ApexDigital.Infrastructure.Persistence;
using ApexDigital.Infrastructure.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ApexDigital.Application.Services;

public class AdminSeedSettings
{
    public string Login { get; set; } = "apex_admin";
    public string Password { get; set; } = "ChangeMe!Str0ng";
    public string DisplayName { get; set; } = "Apex Admin";
}

public class DatabaseSeeder
{
    private readonly MongoDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly AdminSeedSettings _seedSettings;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(MongoDbContext db, IPasswordHasher hasher,
        IOptions<AdminSeedSettings> seedSettings, ILogger<DatabaseSeeder> logger)
    {
        _db = db; _hasher = hasher; _seedSettings = seedSettings.Value; _logger = logger;
    }

    public async Task SeedAsync()
    {
        await _db.EnsureIndexesAsync();

        // Seed admin
        var existingAdmin = await _db.AdminUsers.Find(_ => true).FirstOrDefaultAsync();
        if (existingAdmin == null)
        {
            var admin = new AdminUser
            {
                Login = _seedSettings.Login,
                PasswordHash = _hasher.Hash(_seedSettings.Password),
                DisplayName = _seedSettings.DisplayName,
            };
            await _db.AdminUsers.InsertOneAsync(admin);
            _logger.LogInformation("Admin user '{Login}' seeded. CHANGE THE PASSWORD IMMEDIATELY.", _seedSettings.Login);
        }
        else
        {
            _logger.LogInformation("Admin user already exists, skipping seed.");
        }

        // Seed site settings
        var existingSettings = await _db.SiteSettings.Find(_ => true).FirstOrDefaultAsync();
        if (existingSettings == null)
        {
            await _db.SiteSettings.InsertOneAsync(new SiteSettings());
            _logger.LogInformation("Default site settings created.");
        }
    }
}
