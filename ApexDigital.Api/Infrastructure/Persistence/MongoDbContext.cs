using ApexDigital.Domain.Entities;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ApexDigital.Infrastructure.Persistence;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = "mongodb://localhost:27017";
    public string DatabaseName { get; set; } = "apex_digital";
}

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<AdminUser> AdminUsers => _database.GetCollection<AdminUser>("admin_users");
    public IMongoCollection<Project> Projects => _database.GetCollection<Project>("projects");
    public IMongoCollection<JobVacancy> Jobs => _database.GetCollection<JobVacancy>("jobs");
    public IMongoCollection<JobApplication> JobApplications => _database.GetCollection<JobApplication>("job_applications");
    public IMongoCollection<ServiceRequest> ServiceRequests => _database.GetCollection<ServiceRequest>("service_requests");
    public IMongoCollection<SiteSettings> SiteSettings => _database.GetCollection<SiteSettings>("site_settings");
    public IMongoCollection<AuditLog> AuditLogs => _database.GetCollection<AuditLog>("audit_logs");

    public async Task EnsureIndexesAsync()
    {
        // Projects
        await Projects.Indexes.CreateOneAsync(
            new CreateIndexModel<Project>(Builders<Project>.IndexKeys.Ascending(p => p.Slug),
                new CreateIndexOptions { Unique = true }));
        await Projects.Indexes.CreateOneAsync(
            new CreateIndexModel<Project>(Builders<Project>.IndexKeys.Ascending(p => p.IsVisible)));

        // Jobs
        await Jobs.Indexes.CreateOneAsync(
            new CreateIndexModel<JobVacancy>(Builders<JobVacancy>.IndexKeys.Ascending(j => j.Slug),
                new CreateIndexOptions { Unique = true }));
        await Jobs.Indexes.CreateOneAsync(
            new CreateIndexModel<JobVacancy>(Builders<JobVacancy>.IndexKeys.Ascending(j => j.Status)));

        // JobApplications
        await JobApplications.Indexes.CreateOneAsync(
            new CreateIndexModel<JobApplication>(Builders<JobApplication>.IndexKeys.Ascending(a => a.JobId)));
        await JobApplications.Indexes.CreateOneAsync(
            new CreateIndexModel<JobApplication>(Builders<JobApplication>.IndexKeys.Ascending(a => a.Status)));

        // ServiceRequests
        await ServiceRequests.Indexes.CreateOneAsync(
            new CreateIndexModel<ServiceRequest>(Builders<ServiceRequest>.IndexKeys.Descending(s => s.CreatedAt)));

        // AdminUsers
        await AdminUsers.Indexes.CreateOneAsync(
            new CreateIndexModel<AdminUser>(Builders<AdminUser>.IndexKeys.Ascending(a => a.Login),
                new CreateIndexOptions { Unique = true }));

        // AuditLogs
        await AuditLogs.Indexes.CreateOneAsync(
            new CreateIndexModel<AuditLog>(Builders<AuditLog>.IndexKeys.Descending(a => a.CreatedAt)));
    }
}
