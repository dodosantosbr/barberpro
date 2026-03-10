require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

require("./config/passport");

const app = express();

// ============================
// 🔓 CORS
// ============================
app.use(
  cors({
    origin: ["http://localhost:5173", "https://barberpro-sand.vercel.app"],
    credentials: true,
  })
);

// ============================
// 📦 JSON
// ============================
app.use(express.json());

// ============================
// 🔐 Passport
// ============================
app.use(passport.initialize());

// ============================
// 🟢 Health check (Railway)
// ============================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "API BarberPro online 🚀",
  });
});

// ============================
// Middlewares
// ============================
const auth = require("./middlewares/auth");

// ============================
// 🟢 Rotas públicas
// ============================
app.use("/auth", require("./routes/auth.routes"));

// ============================
// 🔒 Rotas protegidas
// ============================
app.use("/clients", auth, require("./routes/client.routes"));
app.use("/services", auth, require("./routes/service.routes"));
app.use("/appointments", auth, require("./routes/appointment.routes"));
app.use("/dashboard", auth, require("./routes/dashboard.routes"));

// ============================
// 🚨 Erro global
// ============================
app.use((err, req, res, next) => {
  console.error("🔥 ERRO GLOBAL:", err);

  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor",
  });
});

// ============================
// 🚀 Start server
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API BarberPro rodando na porta ${PORT}`);
});
