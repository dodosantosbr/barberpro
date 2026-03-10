const router = require("express").Router();
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

/* =========================
   CADASTRAR BARBEARIA
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, barbershopName } = req.body;

    if (!name || !email || !password || !barbershopName) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // cria barbearia
    const barbershop = await prisma.barbershop.create({
      data: {
        name: barbershopName,
        email,
      },
    });

    // cria usuário dono
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        barbershopId: barbershop.id,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        barbershopId: user.barbershopId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        barbershopId: user.barbershopId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no login" });
  }
});

/* =========================
   USUÁRIO LOGADO
========================= */
router.get("/me", require("../middlewares/auth"), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        barbershopId: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

/* =========================
   ESQUECI MINHA SENHA
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.json({ message: "ok" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExp: new Date(Date.now() + 3600000), // 1 hora
      },
    });

    res.json({
      message: "Token criado",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar token" });
  }
});

/* =========================
   RESETAR SENHA
========================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Token inválido" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    res.json({ message: "Senha alterada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao alterar senha" });
  }
});

module.exports = router;
