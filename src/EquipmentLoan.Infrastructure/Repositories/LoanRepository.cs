using EquipmentLoan.Domain.Entities;
using EquipmentLoan.Domain.Repository;
using EquipmentLoan.Infrastructure.Context;
using EquipmentLoan.Infrastructure.Core;
using Microsoft.EntityFrameworkCore;

namespace EquipmentLoan.Infrastructure.Repositories;

public class LoanRepository(EquipmentLoanContext context)
    : BaseRepository<Loan>(context), ILoanRepository
{
    public override async Task<List<Loan>> GetAllAsync() =>
        await WithDetails().AsNoTracking().OrderByDescending(loan => loan.LoanDate).ToListAsync();

    public override async Task<Loan?> GetByIdAsync(int id) =>
        await WithDetails().FirstOrDefaultAsync(loan => loan.Id == id);

    public async Task<List<Loan>> GetActiveAsync() =>
        await WithDetails().AsNoTracking()
            .Where(loan => loan.Status == "Active")
            .OrderBy(loan => loan.ExpectedReturnDate)
            .ToListAsync();

    private IQueryable<Loan> WithDetails() => _context.Loans
        .Include(loan => loan.Equipment)
        .Include(loan => loan.Employee);
}
