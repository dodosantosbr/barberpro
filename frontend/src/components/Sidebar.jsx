import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const linkStyle = (path) =>
    `block px-4 py-3 rounded-xl transition ${
      location.pathname.startsWith(path)
        ? "bg-green-600 text-white"
        : "text-zinc-400 hover:bg-zinc-800"
    }`;

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-screen
          w-64
          bg-zinc-900
          p-6
          z-50
          transform
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h2 className="text-2xl font-bold mb-10 text-white">Barbearia 💈</h2>

        <nav className="space-y-3">
          <Link
            to="/dashboard"
            className={linkStyle("/dashboard")}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            to="/agenda"
            className={linkStyle("/agenda")}
            onClick={() => setIsOpen(false)}
          >
            Agenda
          </Link>

          <Link
            to="/clients"
            className={linkStyle("/clients")}
            onClick={() => setIsOpen(false)}
          >
            Clientes
          </Link>

          <Link
            to="/services"
            className={linkStyle("/services")}
            onClick={() => setIsOpen(false)}
          >
            Serviços
          </Link>
        </nav>
      </aside>
    </>
  );
}
