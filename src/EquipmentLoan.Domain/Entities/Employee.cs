using EquipmentLoan.Domain.Core;
using System.Text.Json.Serialization;

namespace EquipmentLoan.Domain.Entities;

public class Employee : BaseEntity{
    
    public string EmployeeCode { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    [JsonIgnore]
    public Department? Department { get; set; }

    [JsonIgnore]
    public ICollection<Loan> Loans { get; set; } = [];
   

}
