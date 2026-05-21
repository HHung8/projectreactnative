namespace WebApplication1.Models;

public class Subscription
{
    public Guid Id { get; set; } =  Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = "USD";
    public string Frequency { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
    public string? IconUrl { get; set; } 
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime RenewalDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Foregin key  
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}