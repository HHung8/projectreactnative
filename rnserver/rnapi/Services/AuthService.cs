using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Services;
using Microsoft.EntityFrameworkCore;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly JwtHelper _jwt;

    public AuthService(AppDbContext db, JwtHelper jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            throw new Exception("Email đã được sử dụng.");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _db.Users.Add(user);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // In ra inner exception để biết lỗi thật sự
            throw new Exception(ex.InnerException?.Message ?? ex.Message);
        }

        return await GenerateTokenResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email) ??
                   throw new Exception("Email hoặc mật khẩu không đúng");
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Email hoặc mật khẩu không đúng");
        return await GenerateTokenResponse(user);
    }

   
    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        var token = await _db.RefreshTokens
                        .Include(t => t.User)
                        .FirstOrDefaultAsync(t => t.Token == refreshToken && !t.IsRevoked && t.ExpiresAt > DateTime.UtcNow)
                    ?? throw new Exception("Refresh token không hợp lệ hoặc đã hết hạn.");

        token.IsRevoked = true; // Rotate refresh token
        return await GenerateTokenResponse(token.User);
    }

    public async Task LogoutAsync(string refreshToken)
    {
        var token = await _db.RefreshTokens.FirstOrDefaultAsync(t => t.Token == refreshToken);
        if (token != null)
        {
            token.IsRevoked = true;
            await _db.SaveChangesAsync();
        }
    }
    
    private async Task<AuthResponseDto> GenerateTokenResponse(User user)
    {
        var accessToken = _jwt.GenerateJwtToken(user);
        var refreshToken = _jwt.GenerateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });
        await _db.SaveChangesAsync();
        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            FullName = user.FullName,
            Email = user.Email,
        };
    }

    public async Task ForgotPasswordAsync(string email, string newPassword)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email) ?? throw new Exception("Email không tồn tại");
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _db.SaveChangesAsync();
    }
    
}

