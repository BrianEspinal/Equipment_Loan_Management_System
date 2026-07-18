using EquipmentLoan.Domain.Core;

namespace EquipmentLoan.Domain.Entities;

public class Employee : BaseEntity
{
    public string Identification { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool IsActive { get; set; } = true;

    public int DepartmentId { get; set; }
    public Department Department { get; set; } = null!;

    public ICollection<Loan> Loans { get; set; } = [];
}
