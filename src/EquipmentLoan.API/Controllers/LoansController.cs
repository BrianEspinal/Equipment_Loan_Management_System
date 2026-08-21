using EquipmentLoan.Application.Contract;
using EquipmentLoan.Application.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Equipment_Loan_Management_System__ELMS_.Controllers;

[ApiController]
[Route("api/loans")]
[Route("api/loan")]
[Route("loans")]
[Route("loan")]
public class LoansController(ILoanService loanService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await loanService.GetAllAsync());

    [HttpGet("active")]
    public async Task<IActionResult> GetActive() => Ok(await loanService.GetActiveAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await loanService.GetByIdAsync(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLoanDto dto)
    {
        var result = await loanService.CreateAsync(dto);
        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result)
            : BadRequest(result);
    }

    [HttpPut("{id:int}/return")]
    public async Task<IActionResult> Return(int id, [FromBody] ReturnLoanDto dto)
    {
        var result = await loanService.ReturnAsync(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}
