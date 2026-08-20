using EquipmentLoan.Application.Core;
using EquipmentLoan.Domain.Core;

namespace EquipmentLoan.Application.Contract;

public interface ICrudService<TEntity> where TEntity : BaseEntity
{
    Task<ServiceResult<List<TEntity>>> GetAllAsync();
    Task<ServiceResult<TEntity>> GetByIdAsync(int id);
    Task<ServiceResult<TEntity>> CreateAsync(TEntity entity);
    Task<ServiceResult<TEntity>> UpdateAsync(int id, TEntity entity);
    Task<ServiceResult<bool>> DeleteAsync(int id);
}
