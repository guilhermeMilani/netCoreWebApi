using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ContactsService
    {
        private readonly AppDbContext _context;
        public ContactsService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<Contact>> GetAllContacts()
        {
            return await _context.Contacts.ToListAsync();
        }
        public async Task<Contact?> GetContactById(int id)
        {
            return await _context.Contacts.FindAsync(id);
        }
        public async Task<(bool Success, string? Error)> CreateContact(Contact contact)
        {
            if (await EmailExists(contact.Email))
                return (false, "Email already exists");
    
            if (await PhoneExists(contact.Phone))
                return (false, "Phone already exists");
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();
            return (true, null);
        }
        public async Task<(bool Success, string? Error)> UpdateContact(int id, Contact contact)
        {
            var existing = await GetContactById(id);
            if (existing == null)
                return (false, "Contact not found");
             if (await EmailExists(contact.Email, id))
                return (false, "Email already exists");
    
            if (await PhoneExists(contact.Phone, id))
                return (false, "Phone already exists");
            existing.Name = contact.Name;
            existing.Email = contact.Email;
            existing.Phone = contact.Phone;
            await _context.SaveChangesAsync();
            return (true, null);
        }
        public async Task<bool> DeleteContact(int id)
        {
            var existing = await GetContactById(id);
            if (existing == null)
                return false;
            _context.Contacts.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<bool> EmailExists(string email, int? excludeId = null)
        {
            return await _context.Contacts.AnyAsync(c => c.Email == email && c.Id != excludeId);
        }

        private async Task<bool> PhoneExists(string phone, int? excludeId = null)
        {
            return await _context.Contacts.AnyAsync(c => c.Phone == phone && c.Id != excludeId);
        }
    }
}