import { useEffect, useState } from "react";
import api from "../services/api";

function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    api.get("/clients").then((res) => {
      setClients(res.data);
    });
  };

  const handleSubmit = async () => {
    if (editingClient) {
      await api.put(`/clients/${editingClient.id}`, formData);
    } else {
      await api.post("/clients", formData);
    }

    setShowModal(false);
    setEditingClient(null);
    setFormData({ name: "", phone: "" });
    fetchClients();
  };

  const handleDelete = async (id) => {
    await api.delete(`/clients/${id}`);
    fetchClients();
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({ name: client.name, phone: client.phone });
    setShowModal(true);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
        <h1 className="text-4xl font-bold tracking-wide">Clientes</h1>

        <div className="flex gap-4 w-full md:w-auto">
          {/* Busca */}
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 md:w-64 bg-white/10 backdrop-blur-lg border border-white/20 
                       rounded-xl px-4 py-2 focus:outline-none focus:ring-2 
                       focus:ring-green-500 transition"
          />

          {/* Botão Novo */}
          <button
            onClick={() => {
              setEditingClient(null);
              setFormData({ name: "", phone: "" });
              setShowModal(true);
            }}
            className="bg-green-500 hover:bg-green-600 
                       px-6 py-2 rounded-xl font-semibold 
                       shadow-lg shadow-green-500/30 
                       transition-all duration-300"
          >
            + Novo
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 
                       p-6 rounded-2xl shadow-lg hover:scale-105 
                       transition-all duration-300"
          >
            <h2 className="text-xl font-semibold">{client.name}</h2>
            <p className="text-gray-300 mb-6">{client.phone}</p>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(client)}
                className="flex-1 bg-green-500/80 hover:bg-green-600 
                           py-2 rounded-lg transition"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(client.id)}
                className="flex-1 bg-red-500/80 hover:bg-red-600 
                           py-2 rounded-lg transition"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm 
                        flex items-center justify-center"
        >
          <div
            className="bg-white/10 backdrop-blur-2xl 
                          border border-white/20 
                          p-8 rounded-3xl w-full max-w-md 
                          shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingClient ? "Editar Cliente" : "Novo Cliente"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 
                           rounded-xl px-4 py-3 
                           focus:outline-none focus:ring-2 
                           focus:ring-green-500"
              />

              <input
                type="text"
                placeholder="Telefone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 
                           rounded-xl px-4 py-3 
                           focus:outline-none focus:ring-2 
                           focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-green-500 
                           hover:bg-green-600 
                           shadow-lg shadow-green-500/30 
                           transition-all"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;
