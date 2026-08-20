namespace EquipmentLoan.Application.Dtos;

public class CreateLoanDto
{
    public int EquipmentId { get; set; }
    public int EmployeeId { get; set; }
    public DateTime ExpectedReturnDate { get; set; }
    public string? Notes { get; set; }
    public int? ApprovedByUserId { get; set; }
}
