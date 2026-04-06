using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly ContactsService _service;

        public ContactsController(ContactsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            return await _service.GetAllContacts();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _service.GetContactById(id);

            if (contact == null)
                return NotFound();

            return contact;
        }

        [HttpPost]
        public async Task<ActionResult<Contact>> CreateContact(Contact contact)
        {
            var (success, error) = await _service.CreateContact(contact);
            if (!success)
                return BadRequest(error);

            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(int id, Contact contact)
        {
            var (success, error) = await _service.UpdateContact(id, contact);
            if (!success)
                return BadRequest(error);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var result = await _service.DeleteContact(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}