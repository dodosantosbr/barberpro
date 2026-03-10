import { useEffect, useState } from "react";
import api from "../services/api";

export default function Services() {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const res = await api.get("/services");
    setServices(res.data.data || res.data);
  }

  function openNewServiceModal() {
    setEditingService(null);
    setFormData({ name: "", duration: "", price: "" });
    setShowModal(true);
  }

  function openEditModal(service) {
    setEditingService(service);
    setFormData(service);
    setShowModal(true);
  }

  async function handleSave() {
    if (!formData.name || !formData.duration || !formData.price) {
      alert("Preencha todos os campos");
      return;
    }

    if (editingService) {
      await api.put(`/services/${editingService.id}`, {
        name: formData.name,
        duration: Number(formData.duration),
        price: Number(formData.price),
      });
    } else {
      await api.post("/services", {
        name: formData.name,
        duration: Number(formData.duration),
        price: Number(formData.price),
      });
    }

    setShowModal(false);
    fetchServices();
  }

  async function handleDelete(id) {
    await api.delete(`/services/${id}`);
    fetchServices();
  }

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-gray-400">Gerencie os serviços oferecidos</p>
        </div>

        <button
          onClick={openNewServiceModal}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl"
        >
          + Novo Serviço
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800"
          >
            <h2 className="text-xl font-semibold mb-2">{service.name}</h2>

            <p className="text-gray-400 mb-1">
              Duração: {service.duration} min
            </p>

            <p className="text-green-500 font-bold text-lg">
              R$ {service.price}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => openEditModal(service)}
                className="flex-1 bg-green-600 py-2 rounded-lg"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(service.id)}
                className="flex-1 bg-red-600 py-2 rounded-lg"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-8 rounded-2xl w-96 border border-zinc-800">
            <h2 className="text-xl mb-6">
              {editingService ? "Editar Serviço" : "Novo Serviço"}
            </h2>

            <input
              type="text"
              placeholder="Nome do serviço"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full mb-3 p-3 rounded-lg bg-zinc-800"
            />

            <input
              type="number"
              placeholder="Duração (min)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full mb-3 p-3 rounded-lg bg-zinc-800"
            />

            <input
              type="number"
              placeholder="Preço"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full mb-6 p-3 rounded-lg bg-zinc-800"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-zinc-700 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 rounded-lg"
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
