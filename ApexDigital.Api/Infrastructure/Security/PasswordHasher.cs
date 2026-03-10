namespace ApexDigital.Infrastructure.Security;

/// <summary>
/// BCrypt chosen over PBKDF2 for simplicity and strong defaults.
/// Work factor 12 provides good security/performance balance.
/// </summary>
public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}

public class BcryptPasswordHasher : IPasswordHasher
{
    private const int WorkFactor = 12;

    public string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
    public bool Verify(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
}
