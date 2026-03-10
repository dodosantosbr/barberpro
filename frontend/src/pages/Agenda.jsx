import { useEffect, useState } from "react";
import api from "../services/api";

export default function Agenda() {
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [formData, setFormData] = useState({
    clientId: "",
    serviceId: "",
    time: "",
    status: "scheduled",
  });

  useEffect(() => {
    fetchAppointments();
    fetchClients();
    fetchServices();
  }, [currentDate]);

  async function fetchAppointments() {
    try {
      const res = await api.get("/appointments");
      setAppointments(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    }
  }

  async function fetchClients() {
    try {
      const res = await api.get("/clients");
      setClients(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      setClients([]);
    }
  }

  async function fetchServices() {
    try {
      const res = await api.get("/services");
      setServices(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      setServices([]);
    }
  }

  function changeMonth(direction) {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  }

  function getDaysInMonth() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);

      days.push({
        dayNumber: day,
        fullDate: date.toISOString().split("T")[0],
      });
    }

    return days;
  }

  const days = getDaysInMonth();

  async function handleSave() {
    if (!formData.clientId || !formData.serviceId || !formData.time) {
      alert("Preencha todos os campos");
      return;
    }

    const dateTime = `${selectedDate.fullDate}T${formData.time}:00`;

    await api.post("/appointments", {
      date: dateTime,
      clientId: formData.clientId,
      serviceId: formData.serviceId,
      status: formData.status,
    });

    setSelectedDate(null);

    setFormData({
      clientId: "",
      serviceId: "",
      time: "",
      status: "scheduled",
    });

    fetchAppointments();
  }

  async function deleteAppointment(id) {
    const confirmDelete = window.confirm("Deseja deletar este agendamento?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/appointments/${id}`);

      alert("Agendamento deletado com sucesso");

      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error(
        "Erro ao deletar agendamento:",
        error.response?.data || error
      );
      alert("Erro ao deletar agendamento. Verifique o console.");
    }
  }
  async function updateStatus(status) {
    await api.put(`/appointments/${selectedAppointment.id}`, {
      status,
    });

    setSelectedAppointment(null);
    fetchAppointments();
  }

  const monthName = currentDate.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-4 md:p-8 bg-black text-white min-h-screen">
      <div className="flex justify-center items-center gap-4 mb-8">
        <button
          onClick={() => changeMonth(-1)}
          className="px-3 py-2 bg-zinc-800 rounded-lg"
        >
          ←
        </button>

        <h1 className="text-2xl font-bold capitalize">{monthName}</h1>

        <button
          onClick={() => changeMonth(1)}
          className="px-3 py-2 bg-zinc-800 rounded-lg"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-gray-400 font-semibold">
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div
            key={index}
            className="bg-zinc-900 min-h-[120px] rounded-xl p-2 border border-zinc-800"
          >
            {day && (
              <>
                <div className="flex justify-between mb-2">
                  <span>{day.dayNumber}</span>

                  <button
                    onClick={() => setSelectedDate(day)}
                    className="text-green-500 text-xs"
                  >
                    + Add
                  </button>
                </div>

                {appointments
                  .filter(
                    (a) =>
                      new Date(a.date).toISOString().split("T")[0] ===
                      day.fullDate
                  )
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      onClick={() => setSelectedAppointment(appointment)}
                      className={`text-xs p-2 mb-1 rounded cursor-pointer ${
                        appointment.status === "done"
                          ? "bg-green-600"
                          : appointment.status === "cancelled"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                      }`}
                    >
                      <p>
                        {new Date(appointment.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      <p>{appointment.client?.name}</p>

                      <p>{appointment.service?.name}</p>
                    </div>
                  ))}
              </>
            )}
          </div>
        ))}
      </div>

      {/* MODAL NOVO AGENDAMENTO */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-3">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl mb-4">
              Novo Agendamento - Dia {selectedDate.dayNumber}
            </h2>

            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  time: e.target.value,
                })
              }
              className="w-full mb-3 p-2 rounded bg-zinc-800"
            />

            <select
              value={formData.clientId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  clientId: e.target.value,
                })
              }
              className="w-full mb-3 p-2 rounded bg-zinc-800"
            >
              <option value="">Selecionar cliente</option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>

            <select
              value={formData.serviceId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  serviceId: e.target.value,
                })
              }
              className="w-full mb-3 p-2 rounded bg-zinc-800"
            >
              <option value="">Selecionar serviço</option>

              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedDate(null)}
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

      {/* MODAL EDITAR / DELETAR */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-3">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl mb-4">Agendamento</h2>

            <p className="mb-2">Cliente: {selectedAppointment.client?.name}</p>

            <p className="mb-4">Serviço: {selectedAppointment.service?.name}</p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => updateStatus("done")}
                className="bg-green-600 p-2 rounded"
              >
                Marcar como Concluído
              </button>

              <button
                onClick={() => updateStatus("cancelled")}
                className="bg-yellow-600 p-2 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={() => deleteAppointment(selectedAppointment.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Deletar
              </button>

              <button
                onClick={() => setSelectedAppointment(null)}
                className="bg-zinc-700 p-2 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
