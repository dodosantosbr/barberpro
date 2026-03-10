import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      alert("Erro ao enviar email");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14]">
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md">

        <h1 className="text-white text-2xl font-bold mb-4">
          Recuperar senha
        </h1>

        {sent ? (
          <p className="text-emerald-400">
            Se o email existir, enviamos instruções.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Seu email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border border-white/10 text-white p-3 rounded-xl"
            />

            <button className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl">
              Enviar recuperação
            </button>

          </form>
        )}

      </div>
    </div>
  );
}