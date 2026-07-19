using EquipmentLoan.Domain.Entities;

namespace EquipmentLoan.Domain.Repository;
//padre CRUD EQUIPMENTREPOSITORY

public interface IEquipmentRepository : IBaseRepository<Equipment>
{
    Task <Equipment?> GetByInventoryCodeAsync  //busca un equipo por su código de inventario, devuelve null si !=.
        (string inventoryCode);

    Task<List  <Equipment>>   GetAvailableAsync();  //busca los equipos 'available' para préstamo

    Task<bool> InventoryCodeExistsAsync
        (string inventoryCode);

   ///seRepository en Infrastructure contiene cómo funciona realmente mediante Entity Framework.en ELoan.Infrastructure/core/BaseRepository.cs
}