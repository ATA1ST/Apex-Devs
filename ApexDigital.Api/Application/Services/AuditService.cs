using ApexDigital.Domain.Entities;
using ApexDigital.Infrastructure.Persistence;

namespace ApexDigital.Application.Services;

public interface IAuditService
{
    Task LogAsync(string action, string? entity, string? entityId, string adminLogin, string? details = null, string? ip = null);
}

public class AuditService : IAuditService
{
    private readonly MongoDbContext _db;
    public AuditService(MongoDbContext db) => _db = db;

    public async Task LogAsync(string action, string? entity, string? entityId, string adminLogin, string? details, string? ip)
    {
        await _db.AuditLogs.InsertOneAsync(new AuditLog
        {
            Action = action,
            Entity = entity,
            EntityId = entityId,
            AdminLogin = adminLogin,
            Details = details,
            IpAddress = ip,
        });
    }
}
