
namespace Equipment_Loan_Management_System__ELMS_
{
    public class Categoria
    {
        public int Id { get; set; }

        // Evitamos el CS8618 inicializando con string.Empty
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;

        // Propiedad que aparece en tu captura de Swagger
        public bool IsActive { get; set; } = true;
    }
}
