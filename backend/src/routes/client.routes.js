const router = require("express").Router();
const prisma = require("../config/prisma");
const auth = require("../middlewares/auth");

// ===============================
// 🔹 Criar Cliente
// ===============================
router.post("/", auth, async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: "Nome e telefone são obrigatórios",
      });
    }

    const client = await prisma.client.create({
      data: {
        name,
        phone,
        email,
        barbershopId: req.user.barbershopId,
      },
    });

    return res.status(201).json(client);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

// ===============================
// 🔹 Listar Clientes (com busca + totalCuts otimizado)
// ===============================
router.get("/", auth, async (req, res) => {
  try {
    const { search } = req.query;

    const clients = await prisma.client.findMany({
      where: {
        barbershopId: req.user.barbershopId,
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phone: {
                contains: search,
              },
            },
          ],
        }),
      },
      include: {
        _count: {
          select: {
            appointments: {
              where: {
                status: "completed", // 🔥 corrigido
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedClients = clients.map((client) => ({
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email,
      totalCuts: client._count.appointments,
    }));

    return res.json(formattedClients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

// ===============================
// 🔹 Buscar Cliente por ID
// ===============================
router.get("/:id", auth, async (req, res) => {
  try {
    const client = await prisma.client.findFirst({
      where: {
        id: req.params.id,
        barbershopId: req.user.barbershopId,
      },
    });

    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.json(client);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar cliente" });
  }
});

// ===============================
// 🔹 Atualizar Cliente (100% seguro)
// ===============================
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    const result = await prisma.client.updateMany({
      where: {
        id: req.params.id,
        barbershopId: req.user.barbershopId,
      },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email !== undefined && { email }),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.json({ message: "Cliente atualizado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

// ===============================
// 🔹 Deletar Cliente (100% seguro)
// ===============================
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await prisma.client.deleteMany({
      where: {
        id: req.params.id,
        barbershopId: req.user.barbershopId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar cliente" });
  }
});

module.exports = router;
