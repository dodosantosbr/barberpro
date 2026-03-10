import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // força reload completo
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
      Entrando...
    </div>
  );
}
