import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);

      setTimeout(() => {
        navigate("/");
      }, 800);
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
      {/* Loader */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
      </div>

      <h2 className="mt-6 text-lg font-semibold">Entrando no sistema</h2>

      <p className="text-zinc-400 text-sm mt-2">Preparando seu painel...</p>
    </div>
  );
}
