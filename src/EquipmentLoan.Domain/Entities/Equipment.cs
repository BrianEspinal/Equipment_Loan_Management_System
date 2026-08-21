using EquipmentLoan.Domain.Core;
using System.Text.Json.Serialization;

namespace EquipmentLoan.Domain.Entities;

public class Equipment : BaseEntity
{
    public string InventoryCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Model { get; set; } 
    public string? SerialNumber { get; set; } 
    public string Status { get; set; } = "Available";
    public string? Description { get; set; } 
    public DateTime? PurchaseDate { get; set; }
    public int CategoryId { get; set; }
    [JsonIgnore]
    public Category? Category { get; set; }

    public int BrandId { get; set; }
    [JsonIgnore]
    public Brand? Brand { get; set; }

    [JsonIgnore]
    public ICollection<Loan> Loans { get; set; } = [];
}
