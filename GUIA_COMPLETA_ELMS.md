# Guía completa del Sistema de Pacientes

## 1. Objetivo

El proyecto consiste en un sistema clínico con:

- ASP.NET Core Web API en .NET 10.
- Blazor WebAssembly como aplicación cliente.
- Entity Framework Core y SQL Server LocalDB.
- CRUD mediante interfaces y clases genéricas.
- Arquitectura en N capas.
- Doce tablas relacionadas.
- Inyección de dependencias.
- Migraciones de base de datos.
- Validaciones con Data Annotations.
- Comunicación entre Blazor y la API mediante `HttpClient`.

La solución se creó originalmente en una carpeta independiente llamada
`SistemaPacientes`.

> Nota: la carpeta `SistemaPacientes` no está presente en la rama o copia de
> trabajo actual. Esta guía documenta la versión que se construyó, compiló y
> probó durante la sesión.

---

## 2. Arquitectura utilizada

La solución se dividió en cinco proyectos:

```text
SistemaPacientes
├── SistemaPacientes.slnx
├── dotnet-tools.json
└── src
    ├── SistemaPacientes.Domain
    ├── SistemaPacientes.Application
    ├── SistemaPacientes.Infrastructure
    ├── SistemaPacientes.Api
    └── SistemaPacientes.Client
```

### 2.1 Domain

Contiene las entidades y conceptos centrales del sistema. No conoce SQL
Server, HTTP, Blazor ni Entity Framework.

### 2.2 Application

Contiene los contratos o interfaces y los servicios que representan los casos
de uso. Depende de Domain, pero no de Infrastructure.

### 2.3 Infrastructure

Implementa el acceso a datos. Contiene el `DbContext`, el repositorio de
Entity Framework y el registro de estas implementaciones.

### 2.4 API

Expone los casos de uso mediante endpoints HTTP REST. Recibe peticiones del
cliente y delega el trabajo a los servicios de Application.

### 2.5 Client

Es la aplicación Blazor WebAssembly. Se ejecuta en el navegador y consume la
API mediante solicitudes HTTP.

El flujo de una petición es:

```text
Blazor
  → controlador de la API
  → ICrudService<T>
  → CrudService<T>
  → IRepository<T>
  → EfRepository<T>
  → PatientDbContext
  → SQL Server
```

---

## 3. Creación inicial de la solución

Los proyectos se generaron con estos comandos:

```powershell
mkdir SistemaPacientes
dotnet new sln -n SistemaPacientes -o SistemaPacientes

dotnet new classlib -n SistemaPacientes.Domain `
  -o SistemaPacientes\src\SistemaPacientes.Domain `
  --framework net10.0

dotnet new classlib -n SistemaPacientes.Application `
  -o SistemaPacientes\src\SistemaPacientes.Application `
  --framework net10.0

dotnet new classlib -n SistemaPacientes.Infrastructure `
  -o SistemaPacientes\src\SistemaPacientes.Infrastructure `
  --framework net10.0

dotnet new webapi -n SistemaPacientes.Api `
  -o SistemaPacientes\src\SistemaPacientes.Api `
  --framework net10.0 `
  --use-controllers

dotnet new blazorwasm -n SistemaPacientes.Client `
  -o SistemaPacientes\src\SistemaPacientes.Client `
  --framework net10.0
```

Después se agregaron los proyectos a la solución:

```powershell
dotnet sln SistemaPacientes\SistemaPacientes.slnx add `
  SistemaPacientes\src\SistemaPacientes.Domain\SistemaPacientes.Domain.csproj `
  SistemaPacientes\src\SistemaPacientes.Application\SistemaPacientes.Application.csproj `
  SistemaPacientes\src\SistemaPacientes.Infrastructure\SistemaPacientes.Infrastructure.csproj `
  SistemaPacientes\src\SistemaPacientes.Api\SistemaPacientes.Api.csproj `
  SistemaPacientes\src\SistemaPacientes.Client\SistemaPacientes.Client.csproj
```

---

## 4. Referencias entre capas

Las referencias respetaron la dirección de las dependencias.

### Application

```xml
<ProjectReference
  Include="..\SistemaPacientes.Domain\SistemaPacientes.Domain.csproj" />
```

### Infrastructure

```xml
<ProjectReference
  Include="..\SistemaPacientes.Application\SistemaPacientes.Application.csproj" />
<ProjectReference
  Include="..\SistemaPacientes.Domain\SistemaPacientes.Domain.csproj" />
```

También se agregó:

```xml
<PackageReference
  Include="Microsoft.EntityFrameworkCore.SqlServer"
  Version="10.0.9" />
```

### API

```xml
<ProjectReference
  Include="..\SistemaPacientes.Application\SistemaPacientes.Application.csproj" />
<ProjectReference
  Include="..\SistemaPacientes.Domain\SistemaPacientes.Domain.csproj" />
<ProjectReference
  Include="..\SistemaPacientes.Infrastructure\SistemaPacientes.Infrastructure.csproj" />
```

La API también utilizó:

```xml
<PackageReference
  Include="Microsoft.AspNetCore.OpenApi"
  Version="10.0.10" />

<PackageReference
  Include="Microsoft.OpenApi"
  Version="2.7.5" />

<PackageReference
  Include="Microsoft.EntityFrameworkCore.Design"
  Version="10.0.9">
  <PrivateAssets>all</PrivateAssets>
</PackageReference>
```

---

## 5. Clase base

Todas las entidades heredan de `BaseEntity`:

```csharp
namespace SistemaPacientes.Domain.Common;

public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
```

Esto evita repetir en cada tabla:

- Clave primaria `Id`.
- Fecha de creación.
- Fecha de actualización.

El modificador `abstract` indica que `BaseEntity` no debe convertirse en una
tabla independiente ni crearse directamente.

---

## 6. Las doce tablas

### 6.1 Patients

Representa al paciente.

Campos principales:

- `Identification`
- `FirstName`
- `LastName`
- `BirthDate`
- `Gender`
- `Email`
- `Phone`
- `BloodType`
- `IsActive`

Relaciones:

- Un paciente puede tener muchas direcciones.
- Un paciente puede tener muchas citas.
- Un paciente puede tener muchas historias clínicas.
- Un paciente puede tener muchos seguros.

### 6.2 Addresses

Almacena direcciones de los pacientes.

Clave foránea:

```csharp
public int PatientId { get; set; }
public Patient? Patient { get; set; }
```

### 6.3 Specialties

Catálogo de especialidades médicas, por ejemplo:

- Pediatría
- Cardiología
- Medicina interna

Una especialidad puede tener muchos doctores.

### 6.4 Doctors

Contiene:

- Número de licencia.
- Nombre y apellido.
- Correo y teléfono.
- Especialidad.

La relación se representa con:

```csharp
public int SpecialtyId { get; set; }
public Specialty? Specialty { get; set; }
```

### 6.5 Appointments

Relaciona un paciente con un doctor en una fecha determinada.

Contiene:

- `PatientId`
- `DoctorId`
- `ScheduledAt`
- `Status`
- `Reason`
- `Notes`

### 6.6 MedicalRecords

Representa una entrada de historia clínica.

Contiene:

- Paciente.
- Cita opcional.
- Fecha de registro.
- Notas clínicas.
- Alergias.

Una historia puede contener diagnósticos y recetas.

### 6.7 Diagnoses

Diagnóstico asociado a una historia clínica.

Contiene:

- `MedicalRecordId`
- Código clínico.
- Descripción.

### 6.8 Prescriptions

Receta emitida por un doctor dentro de una historia clínica.

Contiene:

- `MedicalRecordId`
- `DoctorId`
- Fecha de emisión.
- Instrucciones generales.

### 6.9 Medications

Catálogo de medicamentos.

Contiene:

- Nombre.
- Principio activo.
- Presentación.

### 6.10 PrescriptionItems

Detalle de los medicamentos incluidos en una receta.

Relaciona:

- Una receta.
- Un medicamento.

También guarda:

- Dosis.
- Frecuencia.
- Duración.

### 6.11 InsuranceProviders

Catálogo de compañías aseguradoras.

Contiene:

- Nombre.
- Teléfono.
- Correo.

### 6.12 PatientInsurances

Relaciona un paciente con una aseguradora.

Contiene:

- `PatientId`
- `InsuranceProviderId`
- Número de póliza.
- Fecha inicial de vigencia.
- Fecha final opcional.

---

## 7. Validaciones

Las entidades utilizan Data Annotations:

```csharp
[Required]
[MaxLength(80)]
public string FirstName { get; set; } = string.Empty;
```

`Required` indica que el valor es obligatorio.

`MaxLength` limita el tamaño de la columna y evita almacenar texto
excesivamente largo.

También se inicializaron las cadenas:

```csharp
public string FirstName { get; set; } = string.Empty;
```

Esto evita advertencias de referencias anulables.

---

## 8. DbContext

`PatientDbContext` representa la sesión de Entity Framework con la base de
datos:

```csharp
public class PatientDbContext(
    DbContextOptions<PatientDbContext> options) : DbContext(options)
{
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Specialty> Specialties => Set<Specialty>();
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();
    public DbSet<Diagnosis> Diagnoses => Set<Diagnosis>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<Medication> Medications => Set<Medication>();
    public DbSet<PrescriptionItem> PrescriptionItems => Set<PrescriptionItem>();
    public DbSet<InsuranceProvider> InsuranceProviders => Set<InsuranceProvider>();
    public DbSet<PatientInsurance> PatientInsurances => Set<PatientInsurance>();
}
```

Cada `DbSet<T>` representa una tabla.

### Índices únicos

Se configuraron índices para evitar duplicados:

```csharp
modelBuilder.Entity<Patient>()
    .HasIndex(x => x.Identification)
    .IsUnique();

modelBuilder.Entity<Doctor>()
    .HasIndex(x => x.LicenseNumber)
    .IsUnique();

modelBuilder.Entity<Specialty>()
    .HasIndex(x => x.Name)
    .IsUnique();
```

### Relación uno a uno

Una cita puede tener como máximo una historia clínica:

```csharp
modelBuilder.Entity<Appointment>()
    .HasOne(x => x.MedicalRecord)
    .WithOne(x => x.Appointment)
    .HasForeignKey<MedicalRecord>(x => x.AppointmentId)
    .OnDelete(DeleteBehavior.SetNull);
```

### Restricción de borrado

SQL Server inicialmente informó un error de múltiples rutas de eliminación en
cascada. Para evitar la eliminación accidental de información clínica, las
relaciones en cascada se cambiaron a `Restrict`:

```csharp
foreach (var foreignKey in modelBuilder.Model
             .GetEntityTypes()
             .SelectMany(x => x.GetForeignKeys()))
{
    if (foreignKey.DeleteBehavior == DeleteBehavior.Cascade)
    {
        foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
    }
}
```

Esto significa que no se puede borrar un registro principal mientras tenga
registros dependientes.

---

## 9. Interfaz del repositorio

En Application se definió:

```csharp
public interface IRepository<T> where T : BaseEntity
{
    Task<IReadOnlyList<T>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<T?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<T> AddAsync(
        T entity,
        CancellationToken cancellationToken = default);

    Task<bool> UpdateAsync(
        T entity,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        int id,
        CancellationToken cancellationToken = default);
}
```

La interfaz define qué operaciones necesita la aplicación, pero no especifica
si los datos provienen de SQL Server, archivos o memoria.

`T` permite reutilizar el contrato con todas las entidades.

---

## 10. Interfaz del servicio

También se creó:

```csharp
public interface ICrudService<T> where T : BaseEntity
{
    Task<IReadOnlyList<T>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<T?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<T> CreateAsync(
        T entity,
        CancellationToken cancellationToken = default);

    Task<bool> UpdateAsync(
        int id,
        T entity,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        int id,
        CancellationToken cancellationToken = default);
}
```

El servicio separa las reglas del caso de uso del acceso directo a la base de
datos.

---

## 11. Servicio CRUD

`CrudService<T>` implementa la lógica compartida:

```csharp
public class CrudService<T>(
    IRepository<T> repository) : ICrudService<T>
    where T : BaseEntity
{
    // Métodos CRUD
}
```

En la creación:

```csharp
entity.Id = 0;
entity.CreatedAt = DateTime.UtcNow;
```

Se fuerza `Id = 0` para que SQL Server genere la clave.

En la actualización:

```csharp
var current = await repository.GetByIdAsync(id, cancellationToken);

if (current is null)
{
    return false;
}

entity.Id = id;
entity.CreatedAt = current.CreatedAt;
entity.UpdatedAt = DateTime.UtcNow;
```

Así se conserva la fecha original de creación y se registra la fecha de
modificación.

---

## 12. Implementación del repositorio

Infrastructure contiene `EfRepository<T>`:

```csharp
public class EfRepository<T>(
    PatientDbContext context) : IRepository<T>
    where T : BaseEntity
{
}
```

### Consultar todos

```csharp
await context.Set<T>()
    .AsNoTracking()
    .OrderBy(x => x.Id)
    .ToListAsync(cancellationToken);
```

`AsNoTracking` mejora las consultas de solo lectura.

### Consultar por ID

```csharp
context.Set<T>()
    .AsNoTracking()
    .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
```

### Crear

```csharp
context.Set<T>().Add(entity);
await context.SaveChangesAsync(cancellationToken);
```

### Actualizar

```csharp
context.Set<T>().Update(entity);
await context.SaveChangesAsync(cancellationToken);
```

### Eliminar

```csharp
var entity = await context.Set<T>()
    .FindAsync([id], cancellationToken);

if (entity is null)
{
    return false;
}

context.Set<T>().Remove(entity);
await context.SaveChangesAsync(cancellationToken);
```

---

## 13. Inyección de dependencias

Infrastructure expone un método de extensión:

```csharp
public static IServiceCollection AddInfrastructure(
    this IServiceCollection services,
    IConfiguration configuration)
{
    services.AddDbContext<PatientDbContext>(options =>
        options.UseSqlServer(
            configuration.GetConnectionString("PatientDatabase")));

    services.AddScoped(
        typeof(IRepository<>),
        typeof(EfRepository<>));

    return services;
}
```

Esto conecta:

```text
IRepository<Patient> → EfRepository<Patient>
IRepository<Doctor>  → EfRepository<Doctor>
```

y así sucesivamente para las doce entidades.

---

## 14. Configuración de la API

En `Program.cs` se registraron:

```csharp
builder.Services.AddOpenApi();

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles);

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddScoped(
    typeof(ICrudService<>),
    typeof(CrudService<>));
```

`ReferenceHandler.IgnoreCycles` evita ciclos al serializar relaciones como:

```text
Patient → Appointments → Patient
```

También se configuró CORS:

```csharp
builder.Services.AddCors(options =>
    options.AddPolicy("BlazorClient", policy =>
        policy.WithOrigins(
                builder.Configuration["ClientUrl"]
                ?? "https://localhost:7170")
            .AllowAnyHeader()
            .AllowAnyMethod()));
```

CORS permite que Blazor, ejecutándose en otro puerto, llame a la API.

En el pipeline:

```csharp
app.UseHttpsRedirection();
app.UseCors("BlazorClient");
app.UseAuthorization();
app.MapControllers();
```

---

## 15. Controlador CRUD genérico

Se creó un controlador base:

```csharp
[ApiController]
public abstract class CrudController<T>(
    ICrudService<T> service) : ControllerBase
    where T : BaseEntity
{
}
```

Operaciones:

```text
GET    /api/recurso
GET    /api/recurso/{id}
POST   /api/recurso
PUT    /api/recurso/{id}
DELETE /api/recurso/{id}
```

Respuestas utilizadas:

- `200 OK`: consulta correcta.
- `201 Created`: creación correcta.
- `204 No Content`: actualización o eliminación correcta.
- `404 Not Found`: el ID no existe.

---

## 16. Controladores concretos

Cada entidad tiene un controlador pequeño que hereda el CRUD:

```csharp
[Route("api/patients")]
public class PatientsController(
    ICrudService<Patient> service)
    : CrudController<Patient>(service);
```

Se crearon rutas para:

```text
/api/patients
/api/addresses
/api/specialties
/api/doctors
/api/appointments
/api/medical-records
/api/diagnoses
/api/prescriptions
/api/medications
/api/prescription-items
/api/insurance-providers
/api/patient-insurances
```

---

## 17. Cadena de conexión

En `SistemaPacientes.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "PatientDatabase": "Server=(localdb)\\MSSQLLocalDB;Database=SistemaPacientesDb;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "ClientUrl": "https://localhost:7170"
}
```

Componentes:

- Servidor: SQL Server LocalDB.
- Base de datos: `SistemaPacientesDb`.
- Autenticación: usuario actual de Windows.
- Certificado de desarrollo confiable.

---

## 18. Migraciones

Se creó un manifiesto de herramientas local:

```powershell
dotnet new tool-manifest
dotnet tool install dotnet-ef --version 10.0.9
```

Esto generó `dotnet-tools.json`.

Para restaurar la herramienta en otra computadora:

```powershell
dotnet tool restore
```

La migración inicial se creó con:

```powershell
dotnet tool run dotnet-ef migrations add InitialCreate `
  --project src\SistemaPacientes.Infrastructure\SistemaPacientes.Infrastructure.csproj `
  --startup-project src\SistemaPacientes.Api\SistemaPacientes.Api.csproj `
  --output-dir Persistence\Migrations
```

Después se aplicó:

```powershell
dotnet tool run dotnet-ef database update `
  --project src\SistemaPacientes.Infrastructure\SistemaPacientes.Infrastructure.csproj `
  --startup-project src\SistemaPacientes.Api\SistemaPacientes.Api.csproj
```

La migración creó correctamente las doce tablas, claves foráneas e índices.

---

## 19. Cliente Blazor WebAssembly

El cliente se configuró para leer la dirección de la API:

```json
{
  "ApiUrl": "https://localhost:7151"
}
```

En `Program.cs`:

```csharp
var apiUrl =
    builder.Configuration["ApiUrl"]
    ?? "https://localhost:7151";

builder.Services.AddScoped(_ =>
    new HttpClient
    {
        BaseAddress = new Uri(apiUrl)
    });
```

Esto permite inyectar `HttpClient` en los componentes:

```razor
@inject HttpClient Http
```

---

## 20. Modelo del formulario de paciente

El cliente utiliza `PatientModel`:

```csharp
public class PatientModel
{
    public int Id { get; set; }

    [Required(ErrorMessage = "La identificación es obligatoria.")]
    public string Identification { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre es obligatorio.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es obligatorio.")]
    public string LastName { get; set; } = string.Empty;

    public DateOnly BirthDate { get; set; } = new(2000, 1, 1);
    public string Gender { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "El correo no es válido.")]
    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;
    public string BloodType { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
```

---

## 21. Formulario Blazor

La pantalla `/patients` utiliza:

```razor
<EditForm Model="model" OnValidSubmit="SaveAsync">
    <DataAnnotationsValidator />
    <ValidationSummary />

    <InputText @bind-Value="model.Identification" />
    <InputText @bind-Value="model.FirstName" />
    <InputText @bind-Value="model.LastName" />
    <InputDate @bind-Value="model.BirthDate" />
    <InputCheckbox @bind-Value="model.IsActive" />

    <button type="submit">Guardar</button>
</EditForm>
```

`OnValidSubmit` ejecuta el método solamente cuando el modelo es válido.

---

## 22. Consumo HTTP desde Blazor

### Listar

```csharp
patients =
    await Http.GetFromJsonAsync<List<PatientModel>>(
        "/api/patients")
    ?? [];
```

### Crear

```csharp
await Http.PostAsJsonAsync("/api/patients", model);
```

### Actualizar

```csharp
await Http.PutAsJsonAsync(
    $"/api/patients/{model.Id}",
    model);
```

### Eliminar

```csharp
await Http.DeleteAsync(
    $"/api/patients/{id}");
```

Después de cada modificación se vuelve a cargar la lista.

---

## 23. Ejecución

Desde la carpeta `SistemaPacientes`:

### Restaurar

```powershell
dotnet restore SistemaPacientes.slnx
dotnet tool restore
```

### Aplicar la base de datos

```powershell
dotnet tool run dotnet-ef database update `
  --project src\SistemaPacientes.Infrastructure `
  --startup-project src\SistemaPacientes.Api
```

### Iniciar API

```powershell
dotnet run --project src\SistemaPacientes.Api
```

### Iniciar Blazor

```powershell
dotnet run --project src\SistemaPacientes.Client
```

Direcciones:

```text
API:     https://localhost:7151
Blazor:  https://localhost:7170
```

---

## 24. Inicio desde Visual Studio

No se deben iniciar estos proyectos:

- Domain
- Application
- Infrastructure

Son bibliotecas de clases.

Para iniciar todo:

1. Clic derecho en la solución.
2. Seleccionar **Configurar proyectos de inicio**.
3. Elegir **Varios proyectos de inicio**.
4. Configurar `SistemaPacientes.Api` como **Iniciar**.
5. Configurar `SistemaPacientes.Client` como **Iniciar**.
6. Dejar las otras capas en **Ninguno**.
7. Presionar `F5`.

La API debe tener:

```json
"launchBrowser": false
```

El cliente debe tener:

```json
"launchBrowser": true
```

---

## 25. Pruebas que se realizaron

Primero se compiló toda la solución:

```powershell
dotnet build SistemaPacientes.slnx
```

Resultado final:

```text
Build succeeded.
0 Warning(s)
0 Error(s)
```

Después se inició temporalmente la API y se verificó:

1. `POST /api/patients`: creó un paciente.
2. `GET /api/patients`: devolvió la lista.
3. `PUT /api/patients/1`: modificó el apellido.
4. `GET /api/patients/1`: confirmó la modificación.
5. `DELETE /api/patients/1`: eliminó el paciente.
6. El cliente Blazor respondió con HTTP 200.

Resultado:

```text
CreatedId: 1
ListedCount: 1
UpdatedLastName: Actualizado
DeleteSucceeded: True
BlazorStatus: 200
```

---

## 26. Errores solucionados

### Biblioteca de clases no ejecutable

Mensaje:

```text
A project with an Output Type of Class Library cannot be started directly.
```

Causa: intentar iniciar Domain, Application o Infrastructure.

Solución: iniciar API y Client.

### Múltiples rutas de cascada

Mensaje de SQL Server:

```text
may cause cycles or multiple cascade paths
```

Causa: un paciente podía alcanzar una historia clínica mediante más de una
ruta de borrado.

Solución: usar `DeleteBehavior.Restrict` para relaciones clínicas.

### Blazor no puede conectarse

Posibles causas:

- La API no está ejecutándose.
- La URL de `ApiUrl` no coincide con el puerto de la API.
- CORS no acepta el origen del cliente.
- El certificado HTTPS local no fue aceptado.

Comprobar:

```text
API: https://localhost:7151
Cliente: https://localhost:7170
```

### Detener la ejecución

En una terminal:

```text
Ctrl + C
```

En Visual Studio:

```text
Shift + F5
```

---

## 27. Conceptos de N capas aplicados

- Separación de responsabilidades.
- Entidades de dominio.
- Capa de aplicación.
- Interfaces.
- Inversión de dependencias.
- Inyección de dependencias.
- Repositorio genérico.
- Servicio genérico.
- Persistencia con Entity Framework.
- Configuración externa.
- API REST.
- Cliente separado de la API.
- Programación asíncrona.
- Validación.
- Migraciones.
- Relaciones y claves foráneas.
- CORS.
- Manejo de códigos HTTP.

---

## 28. Mejoras recomendadas

Para una versión de producción se recomienda:

1. Crear DTOs separados de las entidades.
2. Agregar AutoMapper o mapeo manual.
3. Implementar autenticación JWT.
4. Crear roles de administrador, doctor y recepción.
5. Añadir paginación y búsqueda.
6. Agregar pruebas unitarias.
7. Agregar pruebas de integración.
8. Implementar borrado lógico.
9. Manejar excepciones con middleware.
10. Incorporar registros de auditoría.
11. Usar secretos para la cadena de conexión.
12. Añadir CRUD visual para los otros módulos.

La versión construida cumple la base solicitada: API .NET, cliente Blazor
WebAssembly, interfaces, arquitectura N capas, doce tablas y CRUD funcional de
pacientes.
