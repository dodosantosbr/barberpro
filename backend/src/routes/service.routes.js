const router = require("express").Router();
const prisma = require("../config/prisma");
const auth = require("../middlewares/auth");

// ==================================
// 🔹 Criar Serviço
// ==================================
router.post("/", auth, async (req, res) => {
  try {
    let { name, price, duration } = req.body;

    if (!name || price === undefined || duration === undefined) {
      return res.status(400).json({
        error: "Nome, preço e duração são obrigatórios",
      });
    }

    price = parseFloat(price);
    duration = parseInt(duration);

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        error: "Preço inválido",
      });
    }

    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({
        error: "Duração inválida",
      });
    }

    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        price,
        duration,
        barbershopId: req.user.barbershopId,
      },
    });

    return res.status(201).json(service);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao criar serviço",
    });
  }
});

// ==================================
// 🔹 Listar Serviços (com busca + paginação)
// ==================================
router.get("/", auth, async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      barbershopId: req.user.barbershopId,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    };

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { name: "asc" },
      }),
      prisma.service.count({ where }),
    ]);

    return res.json({
      data: services,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao buscar serviços",
    });
  }
});

// ==================================
// 🔹 Buscar Serviço por ID
// ==================================
router.get("/:id", auth, async (req, res) => {
  try {
    const service = await prisma.service.findFirst({
      where: {
        id: req.params.id,
        barbershopId: req.user.barbershopId,
      },
    });

    if (!service) {
      return res.status(404).json({
        error: "Serviço não encontrado",
      });
    }

    return res.json(service);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao buscar serviço",
    });
  }
});

// ==================================
// 🔹 Atualizar Serviço
// ==================================
router.put("/:id", auth, async (req, res) => {
  try {
    let { name, price, duration } = req.body;

    const existingService = await prisma.service.findFirst({
      where: {
        id: req.params.id,
        barbershopId: req.user.barbershopId,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        error: "Serviço não encontrado",
      });
    }

    const data = {};

    if (name) data.name = name.trim();

    if (price !== undefined) {
      price = parseFloat(price);
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: "Preço inválido" });
      }
      data.price = price;
    }

    if (duration !== undefined) {
      duration = parseInt(duration);
      if (isNaN(duration) || duration <= 0) {
        return res.status(400).json({ error: "Duração inválida" });
      }
      data.duration = duration;
    }

    const updatedService = await prisma.service.update({
      where: { id: req.params.id },
      data,
    });

    return res.json(updatedService);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao atualizar serviço",
    });
  }
});

// ==================================
// 🔹 Deletar Serviço (com proteção)
// ==================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const existingService = await prisma.service.findFirst({
      where: {
        id: req.params.id,
        barbershopId: req.user.barbershopId,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        error: "Serviço não encontrado",
      });
    }

    // 🔒 Verifica se tem agendamento vinculado
    const linkedAppointments = await prisma.appointment.count({
      where: {
        serviceId: req.params.id,
      },
    });

    if (linkedAppointments > 0) {
      return res.status(400).json({
        error: "Não é possível deletar serviço com agendamentos vinculados",
      });
    }

    await prisma.service.delete({
      where: { id: req.params.id },
    });

    return res.json({
      message: "Serviço deletado com sucesso",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao deletar serviço",
    });
  }
});

module.exports = router;
