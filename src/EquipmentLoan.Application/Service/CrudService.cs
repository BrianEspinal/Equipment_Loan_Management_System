using EquipmentLoan.Application.Contract;
using EquipmentLoan.Application.Core;
using EquipmentLoan.Domain.Core;
using EquipmentLoan.Domain.Entities;
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
        var validationError = ValidateEntity(entity);
        if (validationError is not null)
            return ServiceResult<TEntity>.Failure(validationError);

        try
        {
            entity.Id = 0;
            await repository.AddAsync(entity);
            await repository.SaveChangesAsync();
            return ServiceResult<TEntity>.Success(entity, "Registro creado correctamente.");
        }
        catch (Exception ex)
        {
            var msg = ex.InnerException?.Message ?? ex.Message;
            return ServiceResult<TEntity>.Failure($"Error al crear el registro: {msg}");
        }
    }

    public async Task<ServiceResult<TEntity>> UpdateAsync(int id, TEntity entity)
    {
        if (id <= 0) return ServiceResult<TEntity>.Failure("El identificador debe ser mayor que cero.");

        var validationError = ValidateEntity(entity);
        if (validationError is not null)
            return ServiceResult<TEntity>.Failure(validationError);

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
            var msg = ex.InnerException?.Message ?? ex.Message;
            return ServiceResult<TEntity>.Failure($"Error al actualizar el registro: {msg}");
        }
    }

    private static string? ValidateEntity(TEntity entity)
    {
        if (entity is Category cat)
        {
            if (string.IsNullOrWhiteSpace(cat.Name))
                return "El nombre de la categoría es obligatorio.";
        }
        else if (entity is Brand br)
        {
            if (string.IsNullOrWhiteSpace(br.Name))
                return "El nombre de la marca es obligatorio.";
        }
        else if (entity is Department dep)
        {
            if (string.IsNullOrWhiteSpace(dep.Name))
                return "El nombre del departamento es obligatorio.";
        }
        else if (entity is Employee emp)
        {
            if (string.IsNullOrWhiteSpace(emp.FirstName) || string.IsNullOrWhiteSpace(emp.LastName))
                return "El nombre y apellido son obligatorios.";
            if (string.IsNullOrWhiteSpace(emp.EmployeeCode))
                return "El código de empleado es obligatorio.";
            if (emp.DepartmentId <= 0)
                return "Debe seleccionar un departamento válido.";
        }
        return null;
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
            var msg = ex.InnerException?.Message ?? ex.Message;
            return ServiceResult<bool>.Failure($"No se puede eliminar el registro. ({msg})");
        }
    }
}
