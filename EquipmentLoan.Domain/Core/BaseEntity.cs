namespace EquipmentLoan.Domain.Core;

public abstract class BaseEntity
{
    public int Id { get; set; } // Identificador único de la entidad
                                // utilizado como clave primaria en la base de datos.
}
