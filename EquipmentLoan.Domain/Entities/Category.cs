using EquipmentLoan.Domain.Core;

namespace EquipmentLoan.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Equipment> Equipments { get; set; } = [];
}
