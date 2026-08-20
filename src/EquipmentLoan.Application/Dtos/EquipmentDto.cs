namespace EquipmentLoan.Application.Dtos;

public class EquipmentDto        
                                //Es metodo de transporte de datos entre capas, sin exponer la entidad directamente.  {comentario para mi}
{
    public int Id { get; set; }

    public string InventoryCode { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Model { get; set; }

    public string? SerialNumber { get; set; }

    public string Status { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;

    public int BrandId { get; set; }

    public string BrandName { get; set; } = string.Empty;
}