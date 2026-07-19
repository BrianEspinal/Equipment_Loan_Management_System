using EquipmentLoan.Application.Core;
using EquipmentLoan.Application.Dtos;

namespace EquipmentLoan.Application.Contract;
//padre CRUD EQUIPMENTSERVICE INterface IEquipmentService : IBaseRepositoryService<EquipmentDto>
public interface IEquipmentService
{
    // Obtiene todos los equipos registrados.
    Task<ServiceResult<List<EquipmentDto>>> GetAllAsync();

    // Busca un equipo mediante su identificador.
    Task<ServiceResult<EquipmentDto>> GetByIdAsync(int id);

    // Obtiene solamente los equipos disponibles.
    Task<ServiceResult<List<EquipmentDto>>> GetAvailableAsync();

    // Registra un equipo después de validar sus datos.
    Task<ServiceResult<EquipmentDto>> CreateAsync(
        CreateEquipmentDto dto);

    // Modifica la información de un equipo existente.
    Task<ServiceResult<EquipmentDto>> UpdateAsync(
        UpdateEquipmentDto dto);

    // Elimina un equipo utilizando su identificador.
    Task<ServiceResult<bool>> DeleteAsync(int id);
}
