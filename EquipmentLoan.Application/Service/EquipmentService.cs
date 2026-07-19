using EquipmentLoan.Application.Contract;
using EquipmentLoan.Application.Core;
using EquipmentLoan.Application.Dtos;
using EquipmentLoan.Domain.Entities;
using EquipmentLoan.Domain.Repository;          


namespace EquipmentLoan.Application.Service;

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _equipmentRepository;

    // Trabajamos con la interfaz para no depender directamente
    // de Entity Framework ni de context
    public EquipmentService(IEquipmentRepository equipmentRepository)
    {
        _equipmentRepository = equipmentRepository;
    }

    public async Task<ServiceResult<List<EquipmentDto>>> GetAllAsync()
    {
        var equipments = await _equipmentRepository.GetAllAsync();

                 // Convertimos las entidades en DTO antes de enviarlas a la API.
        var equipmentDtos = equipments
            .Select(MapToDto)
            .ToList();

        return ServiceResult<List<EquipmentDto>>.Success(
            equipmentDtos,
            "Equipos obtenidos correctamente.");
    }

    public async Task<ServiceResult<EquipmentDto>> GetByIdAsync(int id)
    {
                                                   // Evitamos consultar la base de datos con un Id inválido.
        if (id <= 0)
        {
            return ServiceResult<EquipmentDto>.Failure(
                "El identificador debe ser mayor que cero.");
        }

        var equipment = await _equipmentRepository.GetByIdAsync(id);

        if (equipment is null)
        {
            return ServiceResult<EquipmentDto>.Failure(
                "El equipo no fue encontrado.");
        }

        return ServiceResult<EquipmentDto>.Success(
            MapToDto(equipment));
    }

    public async Task<ServiceResult<List<EquipmentDto>>>
        GetAvailableAsync()
    {
        var equipments =
            await _equipmentRepository.GetAvailableAsync();

        var equipmentDtos = equipments
            .Select(MapToDto)
            .ToList();

        return ServiceResult<List<EquipmentDto>>.Success(
            equipmentDtos,
            "Equipos disponibles obtenidos correctamente.");
    }

    public async Task<ServiceResult<EquipmentDto>> CreateAsync(
        CreateEquipmentDto dto)
    {
        // Validamos todo lo campos antes de intentar crear el equipo.
        var errors = ValidateFields(
            dto.InventoryCode,
            dto.Name,
            dto.Model,
            dto.SerialNumber,
            dto.Description,
            dto.CategoryId,
            dto.BrandId);

        if (errors.Count > 0)
        {
            return ServiceResult<EquipmentDto>.Failure(errors);
        }

        // El código de inventario identifica al equipo dentro de la empresa.
        // Por eso no permitimos que se repita.
        bool codeExists =
            await _equipmentRepository.InventoryCodeExistsAsync(
                dto.InventoryCode.Trim());

        if (codeExists)
        {
            return ServiceResult<EquipmentDto>.Failure(
                "El código de inventario ya está registrado.");
        }

        var equipment = new Equipment
        {
            // Trim elimina espacios innecesarios al inicio y al final.
            InventoryCode = dto.InventoryCode.Trim(),

            Name = dto.Name.Trim(),

            Model = dto.Model?.Trim(),

            SerialNumber = dto.SerialNumber?.Trim(),

            Description = dto.Description?.Trim(),

            // Todo equipo nuevo comienza disponible.
            Status = "Available",

            CategoryId = dto.CategoryId,

            BrandId = dto.BrandId
        };

        await _equipmentRepository.AddAsync(equipment);

        // AddAsync prepara el INSERT y SaveChangesAsync lo ejecuta.
        await _equipmentRepository.SaveChangesAsync();

        return ServiceResult<EquipmentDto>.Success(
            MapToDto(equipment),
            "Equipo creado correctamente.");
    }

    public async Task<ServiceResult<EquipmentDto>> UpdateAsync(
        UpdateEquipmentDto dto)
    {
        if (dto.Id <= 0)
        {
            return ServiceResult<EquipmentDto>.Failure(
                "El identificador debe ser mayor que cero.");
        }

        var errors = ValidateFields(
            dto.InventoryCode,
            dto.Name,
            dto.Model,
            dto.SerialNumber,
            dto.Description,
            dto.CategoryId,
            dto.BrandId,
            dto.Status);

        if (errors.Count > 0)
        {
            return ServiceResult<EquipmentDto>.Failure(errors);
        }

        var equipment =
            await _equipmentRepository.GetByIdAsync(dto.Id);

        if (equipment is null)
        {
            return ServiceResult<EquipmentDto>.Failure(
                "El equipo no fue encontrado.");
        }

        var equipmentWithCode =
            await _equipmentRepository.GetByInventoryCodeAsync(
                dto.InventoryCode.Trim());

        // El mismo equipo puede conservar su código,
                                                     // pero otro equipo no puede utilizarlo.
        if (equipmentWithCode is not null &&
            equipmentWithCode.Id != dto.Id)
        {
            return ServiceResult<EquipmentDto>.Failure(
                "El código pertenece a otro equipo.");
        }

        equipment.InventoryCode = dto.InventoryCode.Trim();

        equipment.Name = dto.Name.Trim();

        equipment.Model = dto.Model?.Trim();

        equipment.SerialNumber = dto.SerialNumber?.Trim();

        equipment.Description = dto.Description?.Trim();

        equipment.Status = dto.Status.Trim();

        equipment.CategoryId = dto.CategoryId;

        equipment.BrandId = dto.BrandId;

        _equipmentRepository.Update(equipment);
        await _equipmentRepository.SaveChangesAsync();

        return ServiceResult<EquipmentDto>.Success(
            MapToDto(equipment),
            "Equipo actualizado correctamente.");
    }

    public async Task<ServiceResult<bool>> DeleteAsync(int id)
    {
        if (id <= 0)
        {
            return ServiceResult<bool>.Failure(
                "El identificador debe ser mayor que cero.");
        }

        var equipment =
            await _equipmentRepository.GetByIdAsync(id);

        if (equipment is null)
        {
            return ServiceResult<bool>.Failure(
                "El equipo no fue encontrado.");
        }

        _equipmentRepository.Delete(equipment);
        await _equipmentRepository.SaveChangesAsync();

        return ServiceResult<bool>.Success(
            true,
            "Equipo eliminado correctamente.");
    }

    private static List<string> ValidateFields(
        string inventoryCode,

        string name,

        string? model,

        string? serialNumber,

        string? description,

        int categoryId,

        int brandId,

        string? status = null)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(inventoryCode))
            errors.Add("El código de inventario es obligatorio.");
        else if (inventoryCode.Length > 30)
            errors.Add("El código no puede superar 30 caracteres.");

        if (string.IsNullOrWhiteSpace(name))
            errors.Add("El nombre es obligatorio.");
        else if (name.Length > 100)
            errors.Add("El nombre no puede superar 100 caracteres.");

        if (model?.Length > 100)
            errors.Add("El modelo no puede superar 100 caracteres.");

        if (serialNumber?.Length > 100)
            errors.Add("El número de serie no puede superar 100 caracteres.");

        if (description?.Length > 500)
            errors.Add("La descripción no puede superar 500 caracteres.");

        if (categoryId <= 0)
            errors.Add("Debe seleccionar una categoría válida.");

        if (brandId <= 0)
            errors.Add("Debe seleccionar una marca válida.");

        string[] allowedStatuses =
        [
            "Available",
            "Loaned",
            "Maintenance",
            "Retired"
        ];

        // En creación no recibimo Status; en actualización sí lo vallidamos
        if (status is not null &&
            !allowedStatuses.Contains(status))
        {
            errors.Add(
                "El estado debe ser Available, Loaned, Maintenance o Retired.");
        }

        return errors;
    }

    private static EquipmentDto MapToDto(Equipment equipment)
    {
      
        return new EquipmentDto  // no vamos a devolvemer la entidad directa para evitar
        // exponer las relaciones completas desde la API.
        {
            Id = equipment.Id,
            InventoryCode = equipment.InventoryCode,
            Name = equipment.Name,
            Model = equipment.Model,
            SerialNumber = equipment.SerialNumber,
            Status = equipment.Status,
            Description = equipment.Description,
            CategoryId = equipment.CategoryId,
            CategoryName = equipment.Category?.Name ?? string.Empty,
            BrandId = equipment.BrandId,
            BrandName = equipment.Brand?.Name ?? string.Empty
        };
    }
}
   // iba a armar la logica del negocio en el controller, pero eso es inconstitucional hice mi carpeta [service] para manejar la lógica de negocio y el controller se encargó de recibir y
  // enviar datos ademas vi que la tare lo pedia explcita mente una carpeta [service] las  // Las expresiones LINQ fueron mi mejores aliada
 // para filtrar, consultar y transformar las entidades en DTOs. tuve que aprender a usarlas y me ayudaron mucho a simplificar el código y hacerlo más legible.
// pq de otra forma terminaba haciendo bucles for y foreach que hacian el codigo mas largo y menos legible [el marte se la entregaba XD]