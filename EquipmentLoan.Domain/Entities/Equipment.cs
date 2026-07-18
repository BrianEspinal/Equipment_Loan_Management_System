using EquipmentLoan.Domain.Core;

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
    public bool IsActive { get; set; } = true;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public int BrandId { get; set; }
    public Brand Brand { get; set; } = null!;

    public ICollection<Loan> Loans { get; set; } = [];
}
