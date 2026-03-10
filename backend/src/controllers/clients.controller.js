import prisma from "../prisma.js";

export async function index(req, res) {
  const clients = await prisma.client.findMany({
    where: {
      barbershopId: req.user.barbershopId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(clients);
}

export async function create(req, res) {
  const { name, phone, email } = req.body;

  const client = await prisma.client.create({
    data: {
      name,
      phone,
      email,
      barbershopId: req.user.barbershopId,
    },
  });

  res.json(client);
}

export async function update(req, res) {
  const { id } = req.params;
  const { name, phone, email } = req.body;

  const client = await prisma.client.update({
    where: { id },
    data: { name, phone, email },
  });

  res.json(client);
}

export async function remove(req, res) {
  const { id } = req.params;

  await prisma.client.delete({
    where: { id },
  });

  res.json({ message: "Cliente removido" });
}
