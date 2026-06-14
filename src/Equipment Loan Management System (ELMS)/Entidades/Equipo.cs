using System;

namespace Equipment_Loan_Management_System__ELMS_
{
    public class Equipo
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;

        // En tu Swagger dice "nullable: true", así que usamos el signo '?'
        public string? NumeroSerie { get; set; }
        public string? Estado { get; set; } = "Disponible";

        public DateTime FechaRegistro { get; set; } = DateTime.Now;
        public int CategoriaId { get; set; }

        // Propiedad de navegación mapeada en tu Swagger
        public Categoria? Categoria { get; set; }

        // Propiedad activa mapeada en tu Swagger
        public bool IsActive { get; set; } = true;
    }
}