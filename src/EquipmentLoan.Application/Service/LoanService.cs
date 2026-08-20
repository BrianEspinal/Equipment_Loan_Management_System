using EquipmentLoan.Application.Contract;
using EquipmentLoan.Application.Core;
using EquipmentLoan.Application.Dtos;
using EquipmentLoan.Domain.Entities;
using EquipmentLoan.Domain.Repository;

namespace EquipmentLoan.Application.Service;

public class LoanService(
    ILoanRepository loanRepository,
    IEquipmentRepository equipmentRepository,
    IBaseRepository<Employee> employeeRepository,
    IBaseRepository<User> userRepository) : ILoanService
{
    public async Task<ServiceResult<List<LoanDto>>> GetAllAsync() =>
        ServiceResult<List<LoanDto>>.Success((await loanRepository.GetAllAsync()).Select(Map).ToList());

    public async Task<ServiceResult<List<LoanDto>>> GetActiveAsync() =>
        ServiceResult<List<LoanDto>>.Success((await loanRepository.GetActiveAsync()).Select(Map).ToList());

    public async Task<ServiceResult<LoanDto>> GetByIdAsync(int id)
    {
        var loan = await loanRepository.GetByIdAsync(id);
        return loan is null ? ServiceResult<LoanDto>.Failure("El préstamo no fue encontrado.") : ServiceResult<LoanDto>.Success(Map(loan));
    }

    public async Task<ServiceResult<LoanDto>> CreateAsync(CreateLoanDto dto)
    {
        if (dto.EquipmentId <= 0 || dto.EmployeeId <= 0)
            return ServiceResult<LoanDto>.Failure("Debe indicar un equipo y un empleado válidos.");
        if (dto.ExpectedReturnDate <= DateTime.UtcNow)
            return ServiceResult<LoanDto>.Failure("La fecha esperada de devolución debe ser futura.");

        var equipment = await equipmentRepository.GetByIdAsync(dto.EquipmentId);
        if (equipment is null) return ServiceResult<LoanDto>.Failure("El equipo no fue encontrado.");
        if (equipment.Status != "Available") return ServiceResult<LoanDto>.Failure("El equipo no está disponible para préstamo.");
        if (await employeeRepository.GetByIdAsync(dto.EmployeeId) is null)
            return ServiceResult<LoanDto>.Failure("El empleado no fue encontrado.");
        if (dto.ApprovedByUserId.HasValue && await userRepository.GetByIdAsync(dto.ApprovedByUserId.Value) is null)
            return ServiceResult<LoanDto>.Failure("El usuario aprobador no fue encontrado.");

        var loan = new Loan
        {
            EquipmentId = dto.EquipmentId,
            EmployeeId = dto.EmployeeId,
            ExpectedReturnDate = dto.ExpectedReturnDate,
            Notes = dto.Notes?.Trim(),
            ApprovedByUserId = dto.ApprovedByUserId,
            Status = "Active"
        };
        equipment.Status = "Loaned";
        equipmentRepository.Update(equipment);
        await loanRepository.AddAsync(loan);
        await loanRepository.SaveChangesAsync();
        var createdLoan = await loanRepository.GetByIdAsync(loan.Id);
        return ServiceResult<LoanDto>.Success(Map(createdLoan!), "Préstamo registrado correctamente.");
    }

    public async Task<ServiceResult<LoanDto>> ReturnAsync(int id, ReturnLoanDto dto)
    {
        var loan = await loanRepository.GetByIdAsync(id);
        if (loan is null) return ServiceResult<LoanDto>.Failure("El préstamo no fue encontrado.");
        if (loan.Status != "Active") return ServiceResult<LoanDto>.Failure("El préstamo ya fue devuelto.");

        loan.ActualReturnDate = dto.ActualReturnDate ?? DateTime.UtcNow;
        loan.Status = "Returned";
        loan.Notes = string.IsNullOrWhiteSpace(dto.Notes) ? loan.Notes : dto.Notes.Trim();
        loan.Equipment!.Status = "Available";
        loanRepository.Update(loan);
        await loanRepository.SaveChangesAsync();
        return ServiceResult<LoanDto>.Success(Map(loan), "Devolución registrada correctamente.");
    }

    private static LoanDto Map(Loan loan) => new()
    {
        Id = loan.Id,
        EquipmentId = loan.EquipmentId,
        EquipmentName = loan.Equipment?.Name ?? string.Empty,
        EmployeeId = loan.EmployeeId,
        EmployeeName = loan.Employee is null ? string.Empty : $"{loan.Employee.FirstName} {loan.Employee.LastName}",
        LoanDate = loan.LoanDate,
        ExpectedReturnDate = loan.ExpectedReturnDate,
        ActualReturnDate = loan.ActualReturnDate,
        Status = loan.Status,
        Notes = loan.Notes
    };
}
