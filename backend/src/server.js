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
    origin: "http://localhost:5173",
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

const auth = require("./middlewares/auth");

// ============================
// 🟢 Rotas públicas
// ============================
app.use("/auth", require("./routes/auth.routes"));

// ============================
// 🔒 Rotas protegidas (apenas login)
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
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));
