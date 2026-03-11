import { useEffect, useState } from "react";
import api from "../services/api";
import UserMenu from "../components/UserMenu";
import BottomNav from "../components/BottomNav";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [newClient, setNewClient] = useState({ name: "", phone: "" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setData(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const res = await api.get("/dashboard/revenue/monthly");
      setMonthlyRevenue(res.data || []);
    } catch {
      setMonthlyRevenue([]);
    }
  };

  const createClient = async () => {
    try {
      await api.post("/clients", newClient);
      setNewClient({ name: "", phone: "" });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  };

  const formatPhone = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  // Função para gerar QR Code
  const fetchQRCode = async () => {
    const clientPhone = "1234567890"; // Substitua pelo número do cliente
    try {
      const response = await api.get(
        `/api/generate-qr?clientPhone=${clientPhone}`
      );
      setQrCodeUrl(response.data.qrCodeUrl); // Salva o QR Code gerado
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchMonthlyRevenue();
    fetchQRCode(); // Chama a função para gerar o QR Code
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950 text-white">
        Carregando dashboard...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white relative overflow-hidden">
        {/* efeitos de fundo */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>

        {/* NAVBAR */}
        <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#0b0f14]/80 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                BarberPro
              </span>
            </h1>

            <nav className="hidden md:flex items-center gap-10 text-sm text-zinc-400">
              <Link to="/" className="hover:text-white transition">
                Dashboard
              </Link>
              <Link to="/clients" className="hover:text-white transition">
                Clientes
              </Link>
              <Link to="/services" className="hover:text-white transition">
                Serviços
              </Link>
              <Link to="/agenda" className="hover:text-white transition">
                Agenda
              </Link>
            </nav>

            <UserMenu />
          </div>
        </header>

        {/* CONTEÚDO */}
        <main className="flex-1 overflow-y-auto px-4 pt-6 pb-24">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card
              title="Agendamentos Hoje"
              value={data.todayAppointments || 0}
            />

            <Card
              title="Faturamento Hoje"
              value={(data.todayRevenue || 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            />

            <Card title="Total de Clientes" value={data.totalClients || 0} />
            <Card title="Total de Serviços" value={data.totalServices || 0} />
          </div>

          {/* GRÁFICO */}
          <div className="relative mt-16 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl p-10">
            <h2 className="text-lg font-semibold tracking-tight mb-8">
              Faturamento Mensal
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid stroke="#27272a" />
                <XAxis dataKey="month" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* QR Code */}
          <div className="mt-16 p-6 bg-zinc-900 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Escaneie o QR Code</h2>
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            ) : (
              <p>Carregando QR Code...</p>
            )}
          </div>
        </main>

        <BottomNav />
      </div>

      {/* MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Novo Cliente</h2>

        <input
          type="text"
          placeholder="Nome"
          value={newClient.name}
          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          className="w-full mb-3 p-2 rounded bg-zinc-800 border border-zinc-700"
        />

        <input
          type="text"
          placeholder="Telefone"
          value={newClient.phone}
          onChange={(e) =>
            setNewClient({
              ...newClient,
              phone: formatPhone(e.target.value),
            })
          }
          className="w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-700"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
          >
            Cancelar
          </button>

          <button
            onClick={createClient}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500"
          >
            Salvar
          </button>
        </div>
      </Modal>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-xl p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/10">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-500" />

      <p className="text-sm text-zinc-400 tracking-wide">{title}</p>
      <p className="text-3xl font-semibold mt-4 tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}
