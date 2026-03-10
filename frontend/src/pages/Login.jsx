export default function Login() {
  const handleGoogleLogin = () => {
    window.location.assign(`${import.meta.env.VITE_API_URL}/auth/google`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] relative overflow-hidden">
      {/* Glow Background Effect */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full -top-32 -left-32" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full bottom-0 right-0" />

      {/* Card */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Barber<span className="text-emerald-400">Pro</span>
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Gerencie sua barbearia de forma inteligente
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 
                       bg-white text-black font-medium 
                       py-3 rounded-xl 
                       hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-200 shadow-lg"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Entrar com Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-zinc-500">Acesso seguro</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Security Text */}
          <p className="text-xs text-zinc-500 text-center leading-relaxed">
            Utilizamos autenticação segura via Google. Seus dados são protegidos
            e nunca compartilhados.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-600 text-xs mt-6">
          © {new Date().getFullYear()} BarberPro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
