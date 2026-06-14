using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

// CORRECCIÓN: Quitamos ".Controllers" de la ruta. Ahora apunta directo a tus carpetas de datos.

namespace Equipment_Loan_Management_System__ELMS_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class APIcontrol : ControllerBase
    {
        private static List<Equipo> bdProductos = new List<Equipo>()
        {
            new Equipo { Id = 1, Nombre = "Laptop Dell XPS 13", Marca = "Dell", NumeroSerie = "DL-12345", Estado = "Disponible", CategoriaId = 1 },
            new Equipo { Id = 2, Nombre = "Proyector Epson X49", Marca = "Epson", NumeroSerie = "EP-98765", Estado = "Prestado", CategoriaId = 2 }
        };

        private static int proximoId = 3;

        // ==========================================
        // 1. GET ALL
        // ==========================================
        [HttpGet]
        public ActionResult<IEnumerable<Equipo>> GetTodos()
        {
            return Ok(bdProductos);
        }

        // ==========================================
        // 2. GET BY ID
        // ==========================================
        [HttpGet("{id}")]
        public ActionResult<Equipo> GetPorId(int id)
        {
            // El signo '?' elimina la advertencia amarilla de conversión de nulos
            Equipo? equipoEncontrado = null;

            foreach (var prod in bdProductos)
            {
                if (prod.Id == id)
                {
                    equipoEncontrado = prod;
                    break;
                }
            }

            if (equipoEncontrado == null)
            {
                return NotFound(new { mensaje = $"El equipo con ID {id} no existe." });
            }

            return Ok(equipoEncontrado);
        }

        // ==========================================
        // 3. POST 
        // ==========================================
        [HttpPost]
        public ActionResult<Equipo> Crear([FromBody] Equipo nuevoEquipo)
        {
            if (nuevoEquipo == null) return BadRequest();

            nuevoEquipo.Id = proximoId++;
            nuevoEquipo.FechaRegistro = DateTime.Now;

            if (string.IsNullOrEmpty(nuevoEquipo.Estado))
            {
                nuevoEquipo.Estado = "Disponible";
            }

            bdProductos.Add(nuevoEquipo);

            return CreatedAtAction(nameof(GetPorId), new { id = nuevoEquipo.Id }, nuevoEquipo);
        }

        // ==========================================
        // 4. PUT 
        // ==========================================
        [HttpPut("{id}")]
        public IActionResult Actualizar(int id, [FromBody] Equipo equipoActualizado)
        {
            Equipo? equipoDestino = null; // Ajustado con '?' para evitar advertencias

            foreach (var prod in bdProductos)
            {
                if (prod.Id == id)
                {
                    equipoDestino = prod;
                    break;
                }
            }

            if (equipoDestino == null)
            {
                return NotFound(new { mensaje = "Equipo no encontrado para actualizar." });
            }

            equipoDestino.Nombre = equipoActualizado.Nombre;
            equipoDestino.Marca = equipoActualizado.Marca;
            equipoDestino.NumeroSerie = equipoActualizado.NumeroSerie;
            equipoDestino.Estado = equipoActualizado.Estado;
            equipoDestino.CategoriaId = equipoActualizado.CategoriaId;

            return NoContent();
        }

        // ==========================================
        // 5. DELETE
        // ==========================================
        [HttpDelete("{id}")]
        public IActionResult Eliminar(int id)
        {
            Equipo? equipoAEliminar = null; // Ajustado con '?' para evitar advertencias

            foreach (var prod in bdProductos)
            {
                if (prod.Id == id)
                {
                    equipoAEliminar = prod;
                    break;
                }
            }

            if (equipoAEliminar == null)
            {
                return NotFound(new { mensaje = "El equipo que intentas eliminar no existe." });
            }

            bdProductos.Remove(equipoAEliminar);
            return NoContent();
        }
    }
}