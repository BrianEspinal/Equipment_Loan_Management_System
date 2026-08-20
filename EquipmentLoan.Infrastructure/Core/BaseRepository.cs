using EquipmentLoan.Domain.Core;

using EquipmentLoan.Domain.Repository;

using EquipmentLoan.Infrastructure.Context;

using Microsoft.EntityFrameworkCore;

///implementamos la interfaz IBaseRepository<TEntity> en la clase BaseRepository<TEntity> 
///para proporcionar una implementación genérica de las operaciones
///CRUD para cualquier entidad que herede de BaseEntity.

namespace EquipmentLoan.Infrastructure.Core;
public class BaseRepository<TEntity> : IBaseRepository<TEntity>
    where TEntity : BaseEntity
    {
    protected readonly EquipmentLoanContext _context;

    protected readonly DbSet<TEntity> _dbSet;

    public BaseRepository(EquipmentLoanContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }
    public virtual async Task<List<TEntity>> GetAllAsync()
    {
        return await _dbSet
            .AsNoTracking()
            .ToListAsync();
    }

    public virtual async Task<TEntity?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task AddAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);
    }


    public void Update(TEntity entity)
    {
        _dbSet.Update(entity);
    }

    public void Delete(TEntity entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
