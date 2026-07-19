namespace EquipmentLoan.Domain.Core;

public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; //createAT para ver si se crea el registro
    public DateTime? UpdatedAt { get; set; }  //UpdateAT para ver si se actualiza el registro
}
