
namespace Equipment_Loan_Management_System__ELMS_
{
    public class Categoria
    {
        public int Id { get; set; }

        // Evitamos el error CS8618 definidendo el tipo de dato de nombre y string  al inicializar con string.Empty
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;

        // Propiedad que aparece en captura de Swagger
        public bool IsActive { get; set; } = true;
    }
}
