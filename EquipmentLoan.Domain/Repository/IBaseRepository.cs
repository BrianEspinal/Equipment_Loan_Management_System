using EquipmentLoan.Domain.Core;

namespace EquipmentLoan.Domain.Repository;  

public interface IBaseRepository<TEntity>
    where TEntity : BaseEntity
{
    Task<List<TEntity>> GetAllAsync();

    Task<TEntity?> GetByIdAsync(int id);

    Task AddAsync(TEntity entity);

    void Update(TEntity entity);

    void Delete(TEntity entity);

    Task<int> SaveChangesAsync();
}
/// Define las operaciones CRUD comunes que deben implementar
/// los repositorios de las entidades que heredan de BaseEntity y 
/// las guarda asi no necesito un UnitofWork