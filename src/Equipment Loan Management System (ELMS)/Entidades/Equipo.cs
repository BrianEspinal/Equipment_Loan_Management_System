using System;

namespace Equipment_Loan_Management_System__ELMS_
{
    public class Equipo
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;

       
        public string? NumeroSerie { get; set; }
        public string? Estado { get; set; } = "Disponible";

        public DateTime FechaRegistro { get; set; } = DateTime.Now;
        public int CategoriaId { get; set; }

        // Propiedad de navegación mapeada en Swagger
        public Categoria? Categoria { get; set; }

       
        public bool IsActive { get; set; } = true;
    }
}
