const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const authMiddleware = require("../middlewares/auth");

/* LOGIN COM GOOGLE */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/* CALLBACK GOOGLE */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      // gera JWT
      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // redireciona para frontend com token
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      res.redirect(`${frontendUrl}/auth/success?token=${token}`);
    } catch (error) {
      console.error("Erro ao gerar token:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

/* USUÁRIO LOGADO */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

module.exports = router;
