import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fundo escuro */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Conteúdo */}
      <div className="relative bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl p-6">
        {children}
      </div>
    </div>,
    document.body
  );
}
