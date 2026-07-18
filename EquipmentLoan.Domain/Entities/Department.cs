using EquipmentLoan.Domain.Core;

namespace EquipmentLoan.Domain.Entities;

public class Department : BaseEntity
{

    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<Employee> Employees { get; set; } = [];
}
