using EquipmentLoan.Domain.Repository;
using EquipmentLoan.Infrastructure.Repositories;
using EquipmentLoan.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using EquipmentLoan.Application.Contract;
using EquipmentLoan.Application.Service;

/// ya para este punto miAPI conoce a infraestructura y el contexto de base de datos.

var builder = WebApplication.CreateBuilder(args);   
builder.Services.AddDbContext<EquipmentLoanContext>(options =>  //172 Registramos context en el sistema de inyección de dependencias de ASP.NET.
    options.UseSqlServer(   // 111 Ussamos SQL Server como proveedor de base de datos
        builder.Configuration.GetConnectionString(
            "EquipmentLoanConnection")));


builder.Services.AddScoped<IEquipmentRepository, EquipmentRepository>();
builder.Services.AddScoped<IEquipmentService, EquipmentService>();


builder.Services.AddScoped<IEquipmentRepository, EquipmentRepository>();  // 172 inyección de dependencias en EquipmentRepository desde IEquipmentRepository.

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
