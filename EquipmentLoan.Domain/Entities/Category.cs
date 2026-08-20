using EquipmentLoan.Domain.Core;
using System.Text.Json.Serialization;

namespace EquipmentLoan.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    [JsonIgnore]
    public ICollection<Equipment> Equipments { get; set; } = [];
}
