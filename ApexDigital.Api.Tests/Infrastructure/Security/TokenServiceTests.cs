using ApexDigital.Infrastructure.Security;
using Microsoft.Extensions.Options;
using NUnit.Framework;

namespace ApexDigital.Api.Tests.Infrastructure.Security;

[TestFixture]
public class TokenServiceTests
{
    [Test]
    public void GenerateToken_AndValidateToken_ReturnExpectedClaims()
    {
        var settings = Options.Create(new JwtSettings
        {
            Secret = "super-secret-key-with-32-plus-characters-12345",
            Issuer = "ApexDigital",
            Audience = "ApexDigitalAdmin",
            ExpirationMinutes = 120,
        });
        var service = new TokenService(settings);

        var token = service.GenerateToken("admin-123", "apex_admin");
        var principal = service.ValidateToken(token);

        Assert.That(principal, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(principal!.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, Is.EqualTo("admin-123"));
            Assert.That(principal.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value, Is.EqualTo("apex_admin"));
            Assert.That(principal.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value, Is.EqualTo("admin"));
        });
    }
}
