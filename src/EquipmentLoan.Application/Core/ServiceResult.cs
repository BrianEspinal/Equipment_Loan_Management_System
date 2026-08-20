namespace EquipmentLoan.Application.Core;

/// Representa el resultado de una operación de servicio,
/// incluyendo estado, mensaje, datos y errores.

public class ServiceResult<T>
{
    public bool IsSuccess { get; set; }


    public string Message { get; set; } = string.Empty;


    public T? Data { get; set; }    //T es un tipo genérico que permite que la clase ServiceResult pueda contener datos de cualquier tipo,
                                    /// lo que la hace flexible y reutilizable para diferentes tipos de resultados de servicio.
                                   

    public List<string> Errors { get; set; } = [];

    public static ServiceResult<T> Success(

        T data,
        string message = "Operación completada exitosamente.")
    {
        return new ServiceResult<T>

       { IsSuccess = true,

         Message = message,

            Data = data
        };
    }

    public static ServiceResult<T> Failure(string error)
    {
        return new ServiceResult<T>
        {IsSuccess = false,

         Message =     "La operación no pudo completarse.",

            Errors =   [error]
        };
    }

    public static ServiceResult<T> Failure(List<string> errors)
    {
        return new ServiceResult<T>

        {IsSuccess = false,

         Message = "Existen errores de validación.",

            Errors = errors
        };
    }
}