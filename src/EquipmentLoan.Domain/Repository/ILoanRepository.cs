using EquipmentLoan.Domain.Entities;

namespace EquipmentLoan.Domain.Repository;

public interface ILoanRepository : IBaseRepository<Loan>
{
    Task<List<Loan>> GetActiveAsync();
}
