import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    barbershopName: "",
  });

  async function handleRegister(e) {
    e.preventDefault();

    const res = await api.post("/auth/register", form);

    localStorage.setItem("token", res.data.token);

    setUser(res.data.user);

    navigate("/dashboard");
  }

  return (
    <form onSubmit={handleRegister}>
      <input
        placeholder="Nome"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Senha"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <input
        placeholder="Nome da Barbearia"
        onChange={(e) => setForm({ ...form, barbershopName: e.target.value })}
      />

      <button>Criar Conta</button>
    </form>
  );
}
