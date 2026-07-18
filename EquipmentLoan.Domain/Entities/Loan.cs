using EquipmentLoan.Domain.Core;

namespace EquipmentLoan.Domain.Entities;

public class Loan : BaseEntity
{
    public int EquipmentId { get; set; }
    public Equipment Equipment { get; set; } = null!;

    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;

    public DateTime LoanDate { get; set; } = DateTime.UtcNow;
    public DateTime ExpecReturnDate { get; set; }
    public DateTime? ActualReturnDate { get; set; }
    public string Status { get; set; } = "Active";
    public string? Notes { get; set; }

    public int? ApprovedByUserId { get; set; }  //la logica es que tome el PK asignada segun el usuario 
                                              // haciendo uso de su valor numerico en la DB por medio [int?
    public User? ApprovedByUser { get; set; } //la logica es que tome el PK asignada segun el usuario 
                                              // haciendo uso de su valor numerico en la DB por medio [int?
}
