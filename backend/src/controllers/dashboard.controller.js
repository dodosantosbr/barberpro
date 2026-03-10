import prisma from "../prisma.js";

export async function summary(req, res) {
  const barbershopId = req.user.barbershopId;

  const today = new Date();
  const startDay = new Date(today.setHours(0, 0, 0, 0));
  const endDay = new Date(today.setHours(23, 59, 59, 999));

  const totalClients = await prisma.client.count({
    where: { barbershopId },
  });

  const totalServices = await prisma.service.count({
    where: { barbershopId },
  });

  const todayAppointments = await prisma.appointment.count({
    where: {
      barbershopId,
      date: {
        gte: startDay,
        lte: endDay,
      },
    },
  });

  const revenue = await prisma.appointment.aggregate({
    where: {
      barbershopId,
      status: "completed",
      date: {
        gte: startDay,
        lte: endDay,
      },
    },
    _sum: {
      price: true,
    },
  });

  const appointments = await prisma.appointment.findMany({
    where: {
      barbershopId,
      date: {
        gte: startDay,
        lte: endDay,
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

  res.json({
    todayAppointments,
    todayRevenue: revenue._sum.price || 0,
    totalClients,
    totalServices,
    appointments,
  });
}
