using EquipmentLoan.Application.Contract;
using EquipmentLoan.Domain.Core;
using Microsoft.AspNetCore.Mvc;

namespace Equipment_Loan_Management_System__ELMS_.Controllers;

[ApiController]
public abstract class CrudController<TEntity>(ICrudService<TEntity> service) : ControllerBase
    where TEntity : BaseEntity
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await service.GetByIdAsync(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TEntity entity)
    {
        var result = await service.CreateAsync(entity);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TEntity entity)
    {
        var result = await service.UpdateAsync(id, entity);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await service.DeleteAsync(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }
}
