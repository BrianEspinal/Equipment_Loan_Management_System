using EquipmentLoan.Domain.Entities;
using EquipmentLoan.Domain.Repository;
using EquipmentLoan.Infrastructure.Context;
using EquipmentLoan.Infrastructure.Core;
using Microsoft.EntityFrameworkCore;

namespace EquipmentLoan.Infrastructure.Repositories;

public class EquipmentRepository
    : BaseRepository<Equipment>, IEquipmentRepository
{
    public EquipmentRepository(EquipmentLoanContext context)
        : base(context)
    {
    }

    public async Task<Equipment?> GetByInventoryCodeAsync(
        string inventoryCode)
    {
        return await _context.Equipments
            .AsNoTracking()
            .Include(equipment => equipment.Category)
            .Include(equipment => equipment.Brand)
            .FirstOrDefaultAsync(
                equipment => equipment.InventoryCode == inventoryCode);
    }

    public async Task<List<Equipment>> GetAvailableAsync()
    {
        return await _context.Equipments
            .AsNoTracking()
            .Include(equipment => equipment.Category)
            .Include(equipment => equipment.Brand)
            .Where(equipment => equipment.Status == "Available")
            .ToListAsync();
    }

    public async Task<bool> InventoryCodeExistsAsync(
        string inventoryCode)
    {
        return await _context.Equipments
            .AnyAsync(equipment =>
                equipment.InventoryCode == inventoryCode);
    }
}


