using EquipmentLoan.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EquipmentLoan.Infrastructure.Migrations;

[DbContext(typeof(EquipmentLoanContext))]
[Migration("AlignModelSchema")]
public partial class AlignModelSchema : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Employees_Departments_DepartmentID",
            table: "Employees");
        migrationBuilder.DropForeignKey(
            name: "FK_Equipments_Brands_BrandId",
            table: "Equipments");
        migrationBuilder.DropForeignKey(
            name: "FK_Equipments_Categories_CategoryId",
            table: "Equipments");
        migrationBuilder.DropForeignKey(
            name: "FK_Loans_Employees_EmployeeId",
            table: "Loans");
        migrationBuilder.DropForeignKey(
            name: "FK_Loans_Equipments_EquipmentId",
            table: "Loans");

        migrationBuilder.RenameColumn(
            name: "ExpecReturnDate",
            table: "Loans",
            newName: "ExpectedReturnDate");

        migrationBuilder.RenameColumn(
            name: "DepartmentID",
            table: "Employees",
            newName: "DepartmentId");

        migrationBuilder.RenameIndex(
            name: "IX_Employees_DepartmentID",
            table: "Employees",
            newName: "IX_Employees_DepartmentId");

        migrationBuilder.AlterColumn<string>(
            name: "InventoryCode",
            table: "Equipments",
            type: "nvarchar(450)",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(max)");

        migrationBuilder.CreateIndex(
            name: "IX_Equipments_InventoryCode",
            table: "Equipments",
            column: "InventoryCode",
            unique: true);

        migrationBuilder.AddForeignKey(
            name: "FK_Employees_Departments_DepartmentId",
            table: "Employees",
            column: "DepartmentId",
            principalTable: "Departments",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
        migrationBuilder.AddForeignKey(
            name: "FK_Equipments_Brands_BrandId",
            table: "Equipments",
            column: "BrandId",
            principalTable: "Brands",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
        migrationBuilder.AddForeignKey(
            name: "FK_Equipments_Categories_CategoryId",
            table: "Equipments",
            column: "CategoryId",
            principalTable: "Categories",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
        migrationBuilder.AddForeignKey(
            name: "FK_Loans_Employees_EmployeeId",
            table: "Loans",
            column: "EmployeeId",
            principalTable: "Employees",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
        migrationBuilder.AddForeignKey(
            name: "FK_Loans_Equipments_EquipmentId",
            table: "Loans",
            column: "EquipmentId",
            principalTable: "Equipments",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(name: "FK_Employees_Departments_DepartmentId", table: "Employees");
        migrationBuilder.DropForeignKey(name: "FK_Equipments_Brands_BrandId", table: "Equipments");
        migrationBuilder.DropForeignKey(name: "FK_Equipments_Categories_CategoryId", table: "Equipments");
        migrationBuilder.DropForeignKey(name: "FK_Loans_Employees_EmployeeId", table: "Loans");
        migrationBuilder.DropForeignKey(name: "FK_Loans_Equipments_EquipmentId", table: "Loans");

        migrationBuilder.DropIndex(
            name: "IX_Equipments_InventoryCode",
            table: "Equipments");

        migrationBuilder.AlterColumn<string>(
            name: "InventoryCode",
            table: "Equipments",
            type: "nvarchar(max)",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(450)");

        migrationBuilder.RenameIndex(
            name: "IX_Employees_DepartmentId",
            table: "Employees",
            newName: "IX_Employees_DepartmentID");

        migrationBuilder.RenameColumn(
            name: "ExpectedReturnDate",
            table: "Loans",
            newName: "ExpecReturnDate");

        migrationBuilder.RenameColumn(
            name: "DepartmentId",
            table: "Employees",
            newName: "DepartmentID");

        migrationBuilder.AddForeignKey(name: "FK_Employees_Departments_DepartmentID", table: "Employees", column: "DepartmentID", principalTable: "Departments", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
        migrationBuilder.AddForeignKey(name: "FK_Equipments_Brands_BrandId", table: "Equipments", column: "BrandId", principalTable: "Brands", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
        migrationBuilder.AddForeignKey(name: "FK_Equipments_Categories_CategoryId", table: "Equipments", column: "CategoryId", principalTable: "Categories", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
        migrationBuilder.AddForeignKey(name: "FK_Loans_Employees_EmployeeId", table: "Loans", column: "EmployeeId", principalTable: "Employees", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
        migrationBuilder.AddForeignKey(name: "FK_Loans_Equipments_EquipmentId", table: "Loans", column: "EquipmentId", principalTable: "Equipments", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
    }
}
