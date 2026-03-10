import { NavLink } from "react-router-dom";
import { Home, Users, Calendar, Settings } from "lucide-react";

export default function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        md:hidden
        bg-[#0b0f14]/95 backdrop-blur-xl
        border-t border-white/5
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <div className="grid grid-cols-4 h-16">
        <NavItem to="/dashboard" icon={Home} label="Home" />
        <NavItem to="/clients" icon={Users} label="Clientes" />
        <NavItem to="/agenda" icon={Calendar} label="Agenda" />
        <NavItem to="/services" icon={Settings} label="Serviços" />
      </div>
    </nav>
  );
}

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex flex-col items-center justify-center gap-1
        text-[11px] font-medium
        transition-all duration-200
        ${isActive ? "text-emerald-400" : "text-zinc-400 hover:text-white"}
      `
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            className={`transition-all duration-200 ${
              isActive ? "scale-110" : "scale-100"
            }`}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
