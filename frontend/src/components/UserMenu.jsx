import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:4000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("USER:", data);
        setUser(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-2xl hover:bg-zinc-800 transition-all duration-200"
      >
        {user.image ? (
          <img
            src={
              user.image
                ? `${user.image}?sz=200`
                : `https://ui-avatars.com/api/?name=${user.name}`
            }
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover border border-zinc-700"
          />
        ) : (
          <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center font-bold">
            {user.name?.charAt(0)}
          </div>
        )}

        <div className="text-left hidden md:block">
          <p className="text-sm font-semibold leading-none">{user.name}</p>
          <p className="text-xs text-zinc-400">{user.email}</p>
        </div>

        <span className="text-zinc-500 text-sm">⌄</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-4 w-64 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="px-5 py-4 border-b border-zinc-800">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-zinc-400 truncate">{user.email}</p>
          </div>

          <div className="border-t border-zinc-800" />

          <button
            onClick={logout}
            className="w-full text-left px-5 py-3 text-red-400 hover:bg-red-600 hover:text-white transition"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
