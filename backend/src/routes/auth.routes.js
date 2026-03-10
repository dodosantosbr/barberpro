const router = require("express").Router();
const prisma = require("../config/prisma");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// ===============================
// 🔐 LOGIN SIMPLES
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email é obrigatório" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        barbershopId: user.barbershopId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// ===============================
// 🔵 LOGIN GOOGLE
// ===============================

// iniciar login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// callback google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
      }

      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      return res.redirect(`${frontendUrl}/auth/success?token=${token}`);
    } catch (error) {
      console.error("ERRO CALLBACK GOOGLE:", error);
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

// ===============================
// 👤 USUÁRIO LOGADO
// ===============================
router.get("/me", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// ===============================
// 🚪 LOGOUT
// ===============================
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.json({ message: "Logout realizado" });
});

module.exports = router;
