import { Link, useLocation } from "react-router-dom";

export default function TopNav({ setIsOpen }) {
  const location = useLocation();

  const navItem = (to, label) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition ${
        location.pathname.startsWith(to)
          ? "bg-emerald-600 text-white"
          : "text-zinc-300 hover:bg-zinc-800"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="flex items-center justify-between px-6 md:px-8 h-16 bg-zinc-900 border-b border-zinc-800">
      {/* botão mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden text-2xl text-zinc-300"
      >
        ☰
      </button>

      <h1 className="text-xl font-bold">💈 BarberPro</h1>

      {/* menu desktop */}
      <nav className="hidden md:flex items-center gap-4">
        {navItem("/dashboard", "Dashboard")}
        {navItem("/clients", "Clientes")}
        {navItem("/services", "Serviços")}
        {navItem("/agenda", "Agenda")}
      </nav>
    </header>
  );
}
