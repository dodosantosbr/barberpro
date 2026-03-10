require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

require("./config/passport");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://seu-frontend.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ status: "API BarberPro online 🚀" });
});

const auth = require("./middlewares/auth");

app.use("/auth", require("./routes/auth.routes"));
app.use("/clients", auth, require("./routes/client.routes"));
app.use("/services", auth, require("./routes/service.routes"));
app.use("/appointments", auth, require("./routes/appointment.routes"));
app.use("/dashboard", auth, require("./routes/dashboard.routes"));

app.use((err, req, res, next) => {
  console.error("🔥 ERRO:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

module.exports = app;
