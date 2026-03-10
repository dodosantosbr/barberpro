const router = require("express").Router();
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

module.exports = router;
