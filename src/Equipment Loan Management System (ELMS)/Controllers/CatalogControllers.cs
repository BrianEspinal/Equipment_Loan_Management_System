using EquipmentLoan.Application.Contract;
using EquipmentLoan.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Equipment_Loan_Management_System__ELMS_.Controllers;

[Route("api/categories")]
public class CategoriesController(ICrudService<Category> service) : CrudController<Category>(service);

[Route("api/brands")]
public class BrandsController(ICrudService<Brand> service) : CrudController<Brand>(service);

[Route("api/departments")]
public class DepartmentsController(ICrudService<Department> service) : CrudController<Department>(service);

[Route("api/employees")]
public class EmployeesController(ICrudService<Employee> service) : CrudController<Employee>(service);
