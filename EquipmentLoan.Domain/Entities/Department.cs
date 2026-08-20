using EquipmentLoan.Domain.Core;
using System.Text.Json.Serialization;

namespace EquipmentLoan.Domain.Entities;

public class Department : BaseEntity
{

    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    [JsonIgnore]
    public ICollection<Employee> Employees { get; set; } = [];
}
