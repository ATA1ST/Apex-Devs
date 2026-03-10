using System.Security.Claims;
using ApexDigital.Application.DTOs;
using ApexDigital.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ApexDigital.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    /// <summary>POST /api/auth/login — Admin login</summary>
    [HttpPost("login")]
    [EnableRateLimiting("login")]
    [ProducesResponseType(typeof(LoginResponse), 200)]
    [ProducesResponseType(typeof(ApiError), 401)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var result = await _authService.LoginAsync(request, ip);
        if (result == null)
            return Unauthorized(new ApiError("Неверный логин или пароль"));

        return Ok(result);
    }

    /// <summary>GET /api/auth/status — Check auth status</summary>
    [HttpGet("status")]
    [Authorize]
    public async Task<IActionResult> Status()
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(adminId))
            return Unauthorized(new AuthStatusResponse(false, null, null));

        var status = await _authService.CheckStatusAsync(adminId);
        return Ok(status);
    }
}

