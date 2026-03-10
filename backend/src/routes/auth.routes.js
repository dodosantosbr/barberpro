const router = require("express").Router();
const prisma = require("../config/prisma");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// ===============================
// 🔐 LOGIN SIMPLES (email)
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

    return res.json({
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// ===============================
// 🔵 LOGIN COM GOOGLE
// ===============================

// 🔹 Inicia autenticação Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// 🔹 Callback do Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  async (req, res) => {
    try {
      const user = req.user;

      const token = jwt.sign(
        {
          id: user.id,
          barbershopId: user.barbershopId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.redirect(`http://localhost:5173/auth/success?token=${token}`);
    } catch (error) {
      console.error(error);
      return res.redirect("http://localhost:5173/login");
    }
  }
);

// ===============================
// 👤 DADOS DO USUÁRIO LOGADO
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

module.exports = router;
