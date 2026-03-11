import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      alert("Digite seu email");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", { email });

      alert("Se o email existir, enviamos instruções para recuperação.");

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.error || "Erro ao enviar email. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14]">
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md">
        <h1 className="text-white text-2xl font-bold mb-2">Recuperar senha</h1>

        <p className="text-gray-400 text-sm mb-6">
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Seu email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border border-white/10 text-white p-3 rounded-xl outline-none"
          />

          <button
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Enviando..." : "Enviar recuperação"}
          </button>
        </form>
      </div>
    </div>
  );
}
