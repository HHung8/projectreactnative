using WebApplication1.DTOs;

namespace WebApplication1.Services;

public interface ISubscriptionService
{
    Task<List<SubscriptionResponseDto>> GetAllAsync(Guid userId);
    Task<SubscriptionResponseDto> CreateAsync(Guid userId, CreateSubscriptionDto dto);
    Task<SubscriptionResponseDto> UpdateAsync(Guid userId, Guid id, CreateSubscriptionDto dto);
    Task DeleteAsync(Guid userId, Guid id);
}