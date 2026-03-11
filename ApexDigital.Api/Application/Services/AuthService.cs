using ApexDigital.Application.DTOs;
using ApexDigital.Domain.Entities;
using ApexDigital.Infrastructure.Persistence;
using ApexDigital.Infrastructure.Security;
using MongoDB.Driver;

namespace ApexDigital.Application.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request, string ipAddress);
    Task<AuthStatusResponse> CheckStatusAsync(string adminId);
    Task<bool> ChangePasswordAsync(string adminId, ChangePasswordRequest request, string ipAddress);
}

public class AuthService : IAuthService
{
    private readonly MongoDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokenService;
    private readonly IAuditService _audit;

    private const int MaxFailedAttempts = 5;
    private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(5);

    public AuthService(MongoDbContext db, IPasswordHasher hasher, ITokenService tokenService, IAuditService audit)
    {
        _db = db;
        _hasher = hasher;
        _tokenService = tokenService;
        _audit = audit;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request, string ipAddress)
    {
        var admin = await _db.AdminUsers.Find(a => a.Login == request.Login).FirstOrDefaultAsync();

        if (admin == null)
        {
            _hasher.Verify("dummy", BCrypt.Net.BCrypt.HashPassword("dummy"));
            await _audit.LogAsync("login_failed", null, null, request.Login, $"Unknown login from {ipAddress}", ipAddress);
            return null;
        }

        if (admin.LockedUntil.HasValue && admin.LockedUntil > DateTime.UtcNow)
        {
            await _audit.LogAsync("login_locked", null, null, admin.Login, $"Account locked. IP: {ipAddress}", ipAddress);
            return null;
        }

        if (!_hasher.Verify(request.Password, admin.PasswordHash))
        {
            admin.FailedAttempts++;
            if (admin.FailedAttempts >= MaxFailedAttempts)
                admin.LockedUntil = DateTime.UtcNow.Add(LockoutDuration);

            await _db.AdminUsers.ReplaceOneAsync(a => a.Id == admin.Id, admin);
            await _audit.LogAsync("login_failed", null, null, admin.Login, $"Bad password (attempt {admin.FailedAttempts}). IP: {ipAddress}", ipAddress);
            return null;
        }

        admin.FailedAttempts = 0;
        admin.LockedUntil = null;
        admin.LastLoginAt = DateTime.UtcNow;
        await _db.AdminUsers.ReplaceOneAsync(a => a.Id == admin.Id, admin);

        var token = _tokenService.GenerateToken(admin.Id, admin.Login);
        await _audit.LogAsync("login_success", null, null, admin.Login, $"IP: {ipAddress}", ipAddress);

        return new LoginResponse(token, 120 * 60, admin.DisplayName);
    }

    public async Task<AuthStatusResponse> CheckStatusAsync(string adminId)
    {
        var admin = await _db.AdminUsers.Find(a => a.Id == adminId).FirstOrDefaultAsync();
        if (admin == null)
            return new AuthStatusResponse(false, null, null);

        return new AuthStatusResponse(true, admin.Login, admin.DisplayName);
    }

    public async Task<bool> ChangePasswordAsync(string adminId, ChangePasswordRequest request, string ipAddress)
    {
        var admin = await _db.AdminUsers.Find(a => a.Id == adminId).FirstOrDefaultAsync();
        if (admin == null)
            return false;

        if (!_hasher.Verify(request.CurrentPassword, admin.PasswordHash))
        {
            await _audit.LogAsync("password_change_failed", "AdminUser", adminId, admin.Login, $"Bad current password. IP: {ipAddress}", ipAddress);
            return false;
        }

        admin.PasswordHash = _hasher.Hash(request.NewPassword);
        admin.FailedAttempts = 0;
        admin.LockedUntil = null;
        admin.UpdatedAt = DateTime.UtcNow;

        await _db.AdminUsers.ReplaceOneAsync(a => a.Id == admin.Id, admin);
        await _audit.LogAsync("password_changed", "AdminUser", adminId, admin.Login, $"Password updated. IP: {ipAddress}", ipAddress);
        return true;
    }
}
