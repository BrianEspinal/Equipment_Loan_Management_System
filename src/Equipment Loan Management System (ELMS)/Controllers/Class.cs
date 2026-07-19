using EquipmentLoan.Application.Contract;
using EquipmentLoan.Application.Dtos;
using EquipmentLoan.Application.Service;
using Microsoft.AspNetCore.Mvc;

namespace Equipment_Loan_Management_System__ELMS_.Controllers;

[ApiController]
[Route("api/equipment")]
public class EquipmentController : ControllerBase
{
    private readonly IEquipmentService _equipmentService;

    //7041 El controlador recibe el servicio mediante inyección de dependencias.
    public EquipmentController(IEquipmentService equipmentService)
    {
        _equipmentService = equipmentService;
    }


    //7041 GET: api/equipment
    [HttpGet]
public async Task<IActionResult> GetAll()
{
    var result = await _equipmentService.GetAllAsync();
    return Ok(result);
}



    //7041 GET: api/equipment/5
    [HttpGet("{id:int}")]
public async Task<IActionResult> GetById(int id)
{
    var result = await _equipmentService.GetByIdAsync(id);

    if (!result.IsSuccess)
        return NotFound(result);

    return Ok(result);
}

    //7041 GET: api/equipment/available
    [HttpGet("available")]
    public async Task<IActionResult> GetAvailable()
    {
        var result = await _equipmentService.GetAvailableAsync();
        return Ok(result);
    }

    //7041 POST: api/equipment
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateEquipmentDto dto)
    {
        var result = await _equipmentService.CreateAsync(dto);

        if (!result.IsSuccess)
            return BadRequest(result);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Data!.Id },
            result);
    }

    // 7041 PUT: api/equipment/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateEquipmentDto dto)
    {
        //2026 El Id de la dirección determina cuál equipo modificar.
        dto.Id = id;

        var result = await _equipmentService.UpdateAsync(dto);

        if (!result.IsSuccess)
            return BadRequest(result);

        return Ok(result);
    }

    // DELETE: api/equipment/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _equipmentService.DeleteAsync(id);

        if (!result.IsSuccess)
            return NotFound(result);

        return Ok(result);
    }
}