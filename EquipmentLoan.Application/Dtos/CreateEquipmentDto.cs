namespace EquipmentLoan.Application.Dtos;

public class CreateEquipmentDto
{
    public string InventoryCode { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Model { get; set; }

    public string? SerialNumber { get; set; }

    public string? Description { get; set; }

    public int CategoryId { get; set; }

    public int BrandId { get; set; }
}