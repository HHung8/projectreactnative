namespace WebApplication1.DTOs;

public class CreateSubscriptionDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = "USD";
    public string Frequency { get; set; } = string.Empty; // ✅ Thêm dòng này
    public string Category { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime RenewalDate { get; set; }
    public string? IconUrl { get; set; }
}

public class SubscriptionResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime RenewalDate { get; set; }
    public DateTime CreatedAt { get; set; }
}