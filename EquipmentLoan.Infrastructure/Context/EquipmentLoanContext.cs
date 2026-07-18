using EquipmentLoan.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EquipmentLoan.Infrastructure.Context
{
    public class EquipmentLoanContext : DbContext
    {
        public EquipmentLoanContext(
            DbContextOptions<EquipmentLoanContext> options)
            : base(options)
        {
        }

        public DbSet<Equipment> Equipments => Set<Equipment>();

        public DbSet<Employee> Employees => Set<Employee>();

        public DbSet<Loan> Loans => Set<Loan>();

        public DbSet<Department> Departments => Set<Department>();

        public DbSet<Category> Categories => Set<Category>();

        public DbSet<Brand> Brands => Set<Brand>();

        public DbSet<User> Users => Set<User>();
    }
}
