import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    barbershopName: "",
  });

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);

      setUser(res.data.user);

      navigate("/dashboard");
    } catch {
      alert("Erro ao criar conta");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full -top-32 -left-32" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full bottom-0 right-0" />

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Barber<span className="text-emerald-400">Pro</span>
            </h1>

            <p className="text-zinc-400 text-sm mt-2">
              Crie sua conta e comece a gerenciar sua barbearia
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Seu nome"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-white/5 border border-white/10 text-white placeholder-zinc-500 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <input
              type="email"
              placeholder="Seu email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-white/5 border border-white/10 text-white placeholder-zinc-500 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <input
              type="password"
              placeholder="Sua senha"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-white/5 border border-white/10 text-white placeholder-zinc-500 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <input
              type="text"
              placeholder="Nome da barbearia"
              required
              onChange={(e) =>
                setForm({ ...form, barbershopName: e.target.value })
              }
              className="bg-white/5 border border-white/10 text-white placeholder-zinc-500 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-zinc-500">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Login */}
          <p className="text-center text-sm text-zinc-400">
            Já tem conta?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Entrar
            </span>
          </p>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6">
          © {new Date().getFullYear()} BarberPro
        </p>
      </div>
    </div>
  );
}
