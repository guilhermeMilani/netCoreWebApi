import { useState, useEffect } from "react";

const API = "http://localhost:5132/api/contacts";

function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  return { toast, showToast };
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-lg text-sm z-50 transition-all duration-300
      ${toast.type === "success"
        ? "bg-green-50 text-green-800 border border-green-200"
        : "bg-red-50 text-red-800 border border-red-200"}`}>
      {toast.msg}
    </div>
  );
}

function Avatar({ name }) {
  const initials = name?.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  return (
    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-medium flex-shrink-0">
      {initials}
    </div>
  );
}

function ContactForm({ onSave, editingContact, onClear }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (editingContact) setForm(editingContact);
  }, [editingContact]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(form);
    setForm({ name: "", email: "", phone: "" });
  };

  const handleClear = () => {
    setForm({ name: "", email: "", phone: "" });
    onClear();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
        {editingContact ? "Editando contato" : "Novo contato"}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Nome</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Email</label>
          <input name="email" value={form.email} onChange={handleChange} placeholder="exemplo@email.com"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-sm text-gray-500">Telefone</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="47999999999"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          Salvar
        </button>
        <button onClick={handleClear}
          className="border border-gray-200 text-gray-500 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition">
          Cancelar
        </button>
      </div>
    </div>
  );
}

function ContactItem({ contact, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-none last:pb-0">
      <Avatar name={contact.name} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{contact.name}</p>
        <p className="text-xs text-gray-400 truncate">{contact.email} · {contact.phone}</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={() => onEdit(contact)}
          className="text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
          Editar
        </button>
        <button onClick={() => onDelete(contact.id)}
          className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
          Excluir
        </button>
      </div>
    </div>
  );
}

function ContactList({ contacts, onEdit, onDelete, onRefresh, loading }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Lista de contatos</p>
        <button onClick={onRefresh}
          className="text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
          Atualizar
        </button>
      </div>

      {loading && <p className="text-center text-gray-400 text-sm py-8">Carregando...</p>}

      {!loading && contacts.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-8">Nenhum contato cadastrado</p>
      )}

      {!loading && contacts.map(c => (
        <ContactItem key={c.id} contact={c} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useToast();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      setContacts(await res.json());
    } catch {
      showToast("Erro ao conectar à API", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleSave = async (form) => {
    if (!form.name || !form.email || !form.phone) {
      showToast("Preencha todos os campos", "error");
      return;
    }

    try {
      const res = await fetch(editingContact ? `${API}/${editingContact.id}` : API, {
        method: editingContact ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(editingContact ? "Contato atualizado!" : "Contato criado!");
        setEditingContact(null);
        fetchContacts();
      } else {
        const err = await res.text();
        showToast(err || "Erro ao salvar", "error");
      }
    } catch {
      showToast("Erro ao conectar à API", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Contato excluído!");
        fetchContacts();
      } else {
        showToast("Erro ao excluir", "error");
      }
    } catch {
      showToast("Erro ao conectar à API", "error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Contatos</h1>
        <ContactForm onSave={handleSave} editingContact={editingContact} onClear={() => setEditingContact(null)} />
        <ContactList contacts={contacts} onEdit={setEditingContact} onDelete={handleDelete} onRefresh={fetchContacts} loading={loading} />
      </div>
      <Toast toast={toast} />
    </div>
  );
}