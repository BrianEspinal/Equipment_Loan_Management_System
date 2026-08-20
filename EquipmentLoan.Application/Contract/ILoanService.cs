using EquipmentLoan.Application.Core;
using EquipmentLoan.Application.Dtos;

namespace EquipmentLoan.Application.Contract;

public interface ILoanService
{
    Task<ServiceResult<List<LoanDto>>> GetAllAsync();
    Task<ServiceResult<List<LoanDto>>> GetActiveAsync();
    Task<ServiceResult<LoanDto>> GetByIdAsync(int id);
    Task<ServiceResult<LoanDto>> CreateAsync(CreateLoanDto dto);
    Task<ServiceResult<LoanDto>> ReturnAsync(int id, ReturnLoanDto dto);
}
