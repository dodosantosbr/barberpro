require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

require("./config/passport");

const app = express();

// Importando a rota para gerar o QR Code
const qrcodeRoutes = require("./routes/qrcode.routes"); // Rota de QR Code

app.use(
  cors({
    origin: ["http://localhost:5173", "https://seu-frontend.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

// Endpoint raiz
app.get("/", (req, res) => {
  res.json({ status: "API BarberPro online 🚀" });
});

const auth = require("./middlewares/auth");

// Roteamento das APIs existentes
app.use("/auth", require("./routes/auth.routes"));
app.use("/clients", auth, require("./routes/client.routes"));
app.use("/services", auth, require("./routes/service.routes"));
app.use("/appointments", auth, require("./routes/appointment.routes"));
app.use("/dashboard", auth, require("./routes/dashboard.routes"));

// Adicionando a nova rota de QR Code
app.use("/api", qrcodeRoutes); // Prefixando a rota com "/api"

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error("🔥 ERRO:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

module.exports = app;
