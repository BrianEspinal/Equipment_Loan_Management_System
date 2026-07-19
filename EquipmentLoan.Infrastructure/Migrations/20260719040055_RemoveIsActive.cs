using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EquipmentLoan.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIsActive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Equipments");
        }
        

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
    name: "IsActive",
    table: "Brands",
    type: "bit",
    nullable: false,
    defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Categories",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Equipments",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }
    }
}
