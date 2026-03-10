import prisma from "../prisma.js";

export async function index(req, res) {
  const services = await prisma.service.findMany({
    where: {
      barbershopId: req.user.barbershopId,
    },
  });

  res.json(services);
}

export async function create(req, res) {
  const { name, price, duration } = req.body;

  const service = await prisma.service.create({
    data: {
      name,
      price,
      duration,
      barbershopId: req.user.barbershopId,
    },
  });

  res.json(service);
}

export async function update(req, res) {
  const { id } = req.params;
  const { name, price, duration } = req.body;

  const service = await prisma.service.update({
    where: { id },
    data: { name, price, duration },
  });

  res.json(service);
}

export async function remove(req, res) {
  const { id } = req.params;

  await prisma.service.delete({
    where: { id },
  });

  res.json({ message: "Serviço removido" });
}
