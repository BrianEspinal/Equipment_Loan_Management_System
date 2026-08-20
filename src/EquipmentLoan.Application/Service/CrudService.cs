using EquipmentLoan.Application.Contract;
using EquipmentLoan.Application.Core;
using EquipmentLoan.Domain.Core;
using EquipmentLoan.Domain.Repository;

namespace EquipmentLoan.Application.Service;

public class CrudService<TEntity>(IBaseRepository<TEntity> repository)
    : ICrudService<TEntity> where TEntity : BaseEntity
{
    public async Task<ServiceResult<List<TEntity>>> GetAllAsync() =>
        ServiceResult<List<TEntity>>.Success(await repository.GetAllAsync());

    public async Task<ServiceResult<TEntity>> GetByIdAsync(int id)
    {
        if (id <= 0) return ServiceResult<TEntity>.Failure("El identificador debe ser mayor que cero.");
        var entity = await repository.GetByIdAsync(id);
        return entity is null
            ? ServiceResult<TEntity>.Failure("El registro no fue encontrado.")
            : ServiceResult<TEntity>.Success(entity);
    }

    public async Task<ServiceResult<TEntity>> CreateAsync(TEntity entity)
    {
        try
        {
            entity.Id = 0;
            await repository.AddAsync(entity);
            await repository.SaveChangesAsync();
            return ServiceResult<TEntity>.Success(entity, "Registro creado correctamente.");
        }
        catch (Exception ex)
        {
            return ServiceResult<TEntity>.Failure($"Error al crear el registro: {ex.Message}");
        }
    }

    public async Task<ServiceResult<TEntity>> UpdateAsync(int id, TEntity entity)
    {
        try
        {
            var existing = await repository.GetByIdAsync(id);
            if (existing is null) return ServiceResult<TEntity>.Failure("El registro no fue encontrado.");

            entity.Id = id;
            repository.Update(entity);
            await repository.SaveChangesAsync();
            return ServiceResult<TEntity>.Success(entity, "Registro actualizado correctamente.");
        }
        catch (Exception ex)
        {
            return ServiceResult<TEntity>.Failure($"Error al actualizar el registro: {ex.Message}");
        }
    }

    public async Task<ServiceResult<bool>> DeleteAsync(int id)
    {
        try
        {
            var entity = await repository.GetByIdAsync(id);
            if (entity is null) return ServiceResult<bool>.Failure("El registro no fue encontrado.");

            repository.Delete(entity);
            await repository.SaveChangesAsync();
            return ServiceResult<bool>.Success(true, "Registro eliminado correctamente.");
        }
        catch (Exception ex)
        {
            return ServiceResult<bool>.Failure($"No se puede eliminar el registro. Es posible que esté en uso por otros elementos. ({ex.Message})");
        }
    }
}
