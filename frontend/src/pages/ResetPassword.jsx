import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      alert("Token inválido");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        token,
        password,
      });

      alert("Senha redefinida com sucesso");

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Erro ao redefinir senha. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14]">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 p-8 rounded-3xl flex flex-col gap-4 w-full max-w-md backdrop-blur-xl"
      >
        <h1 className="text-white text-2xl font-bold text-center">
          Redefinir senha
        </h1>

        <input
          type="password"
          placeholder="Nova senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white/10 p-3 rounded-xl text-white outline-none"
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-white/10 p-3 rounded-xl text-white outline-none"
        />

        <button
          disabled={loading}
          className="bg-emerald-500 py-3 rounded-xl text-white font-semibold hover:bg-emerald-600 transition"
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}