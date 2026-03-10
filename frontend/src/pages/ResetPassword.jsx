import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/auth/reset-password", {
        token,
        password,
      });

      alert("Senha alterada");
      navigate("/login");
    } catch {
      alert("Token inválido");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14]">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 p-8 rounded-3xl flex flex-col gap-4 w-full max-w-md"
      >
        <h1 className="text-white text-2xl font-bold">Nova senha</h1>

        <input
          type="password"
          placeholder="Nova senha"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white/10 p-3 rounded-xl text-white"
        />

        <button className="bg-emerald-500 py-3 rounded-xl text-white">
          Salvar nova senha
        </button>
      </form>
    </div>
  );
}
