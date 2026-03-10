const router = require("express").Router();
const prisma = require("../config/prisma");
const auth = require("../middlewares/auth");

// ===============================
// 📊 DASHBOARD PRINCIPAL
// ===============================
router.get("/", auth, async (req, res) => {
  try {
    const { barbershopId } = req.user;

    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );

    const todayAppointmentsCount = await prisma.appointment.count({
      where: {
        barbershopId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const todayRevenue = await prisma.appointment.aggregate({
      where: {
        barbershopId,
        status: "done",
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: {
        price: true,
      },
    });

    const totalClients = await prisma.client.count({
      where: { barbershopId },
    });

    const totalServices = await prisma.service.count({
      where: { barbershopId },
    });

    const todayAppointments = await prisma.appointment.findMany({
      where: {
        barbershopId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        client: true,
        service: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const barbershop = await prisma.barbershop.findUnique({
      where: {
        id: barbershopId,
      },
      select: {
        subscriptionStatus: true,
        currentPeriodEnd: true,
      },
    });

    return res.json({
      todayAppointments: todayAppointmentsCount,
      todayRevenue: todayRevenue._sum?.price ?? 0,
      totalClients,
      totalServices,
      appointments: todayAppointments,

      subscriptionStatus: barbershop?.subscriptionStatus,
      currentPeriodEnd: barbershop?.currentPeriodEnd,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
});

// ===============================
// 📈 FATURAMENTO MENSAL
// ===============================
router.get("/revenue/monthly", auth, async (req, res) => {
  try {
    const { barbershopId } = req.user;

    const currentYear = new Date().getFullYear();

    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const appointments = await prisma.appointment.findMany({
      where: {
        barbershopId,
        status: "done",
        date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        date: true,
        price: true,
      },
    });

    const monthlyRevenue = Array(12).fill(0);

    appointments.forEach((appt) => {
      const monthIndex = new Date(appt.date).getMonth();
      monthlyRevenue[monthIndex] += appt.price ?? 0;
    });

    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    const result = months.map((month, index) => ({
      month,
      revenue: monthlyRevenue[index],
    }));

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao calcular faturamento mensal",
    });
  }
});

module.exports = router;
