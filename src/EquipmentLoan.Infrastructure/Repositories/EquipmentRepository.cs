using EquipmentLoan.Domain.Entities;
//
using EquipmentLoan.Domain.Repository;
//
using EquipmentLoan.Infrastructure.Context;
//
using EquipmentLoan.Infrastructure.Core;
//
using Microsoft.EntityFrameworkCore;
//
namespace EquipmentLoan.Infrastructure.Repositories;
/// Implementación de la interfaz IEquipmentRepository para el repositorio de equipos
public class EquipmentRepository
    : BaseRepository<Equipment>, IEquipmentRepository
{
    public EquipmentRepository(EquipmentLoanContext context)
        : base(context)
    {
    }

    public override async Task<List<Equipment>> GetAllAsync()
    {
        return await _context.Equipments
            .AsNoTracking()
            .Include(equipment => equipment.Category)
            .Include(equipment => equipment.Brand)
            .OrderBy(equipment => equipment.Name)
            .ToListAsync();
    }

    public override async Task<Equipment?> GetByIdAsync(int id)
    {
        return await _context.Equipments
            .Include(equipment => equipment.Category)
            .Include(equipment => equipment.Brand)
            .FirstOrDefaultAsync(equipment => equipment.Id == id);
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


