using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly AppDbContext _db;

    public SubscriptionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<SubscriptionResponseDto>> GetAllAsync(Guid userId)
    {
        return await _db.Subscriptions
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => ToDto(s))
            .ToListAsync();
    }

    public async Task<SubscriptionResponseDto> CreateAsync(Guid userId, CreateSubscriptionDto dto)
    {
        var subscription = new Subscription
        {
            Name = dto.Name,
            Price = dto.Price,
            Currency = dto.Currency,
            Frequency = dto.Frequency,
            Category = dto.Category,
            StartDate = dto.StartDate,
            RenewalDate = dto.RenewalDate,
            IconUrl = dto.IconUrl,
            UserId = userId,
        };
        _db.Subscriptions.Add(subscription);
        await _db.SaveChangesAsync();
        return ToDto(subscription);
    }

public async Task<SubscriptionResponseDto> UpdateAsync(Guid userId, Guid id, CreateSubscriptionDto dto)
{
    var subscription = await _db.Subscriptions
                           .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId)
                       ?? throw new Exception("Subscription không tồn tại");
    subscription.Name = dto.Name;
    subscription.Price = dto.Price;
    subscription.Currency = dto.Currency;
    subscription.StartDate = dto.StartDate;
    subscription.RenewalDate = dto.RenewalDate; // ✅ Sửa RenewDate → RenewalDate
    await _db.SaveChangesAsync();
    return ToDto(subscription);
}
    public async Task DeleteAsync(Guid userId, Guid id)
    {
        var subscription = await _db.Subscriptions
                               .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId)
                           ?? throw new Exception("Subscription không tồn tại");
        _db.Subscriptions.Remove(subscription);
        await  _db.SaveChangesAsync();
    }

    private static SubscriptionResponseDto ToDto(Subscription s) => new()
    {
        Id = s.Id,
        Name = s.Name,
        Price = s.Price,
        Currency = s.Currency,
        Frequency = s.Frequency,
        Category = s.Category,
        Status = s.Status,
        StartDate = s.StartDate,
        RenewalDate = s.RenewalDate,
        CreatedAt = s.CreatedAt,
    };
    
}