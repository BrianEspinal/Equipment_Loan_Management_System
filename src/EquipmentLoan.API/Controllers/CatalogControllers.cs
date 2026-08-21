using EquipmentLoan.Application.Contract;
using EquipmentLoan.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Equipment_Loan_Management_System__ELMS_.Controllers;

[ApiController]
[Route("api/categories")]
[Route("api/category")]
[Route("categories")]
public class CategoriesController(ICrudService<Category> service) : CrudController<Category>(service);

[ApiController]
[Route("api/brands")]
[Route("api/brand")]
[Route("brands")]
public class BrandsController(ICrudService<Brand> service) : CrudController<Brand>(service);

[ApiController]
[Route("api/departments")]
[Route("api/department")]
[Route("departments")]
public class DepartmentsController(ICrudService<Department> service) : CrudController<Department>(service);

[ApiController]
[Route("api/employees")]
[Route("api/employee")]
[Route("employees")]
public class EmployeesController(ICrudService<Employee> service) : CrudController<Employee>(service);
