using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EquipmentLoan.Infrastructure.Migrations
{
 
    public partial class RemoveIsActive : Migration
    {
     
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
