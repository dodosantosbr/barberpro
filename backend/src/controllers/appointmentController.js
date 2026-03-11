const prisma = require("../config/prisma");
const { sendWhatsappMessage } = require("../services/whatsapp");

// LISTAR AGENDAMENTOS
exports.listAppointments = async (req, res) => {
  try {
    const barbershopId = req.user.barbershopId;

    const appointments = await prisma.appointment.findMany({
      where: { barbershopId },
      include: {
        client: true,
        services: true, // Modificado para pegar múltiplos serviços
      },
      orderBy: {
        date: "asc",
      },
    });

    res.json(appointments);
  } catch (error) {
    console.error("Erro listAppointments:", error);
    res.status(500).json({ error: "Erro ao listar agendamentos" });
  }
};

// CRIAR AGENDAMENTO
exports.createAppointment = async (req, res) => {
  try {
    const { date, clientId, serviceIds } = req.body; // serviceIds agora é um array
    const barbershopId = req.user.barbershopId;

    if (!date || !clientId || !serviceIds || serviceIds.length === 0) {
      return res.status(400).json({
        error: "Dados obrigatórios não enviados",
      });
    }

    const startDate = new Date(date);

    // Verificando se todos os serviços existem
    const services = await prisma.service.findMany({
      where: {
        id: {
          in: serviceIds,
        },
      },
    });

    if (services.length !== serviceIds.length) {
      return res.status(404).json({
        error: "Alguns serviços não encontrados",
      });
    }

    // Calculando o horário de término baseado na duração de todos os serviços
    let endDate = new Date(startDate.getTime());
    services.forEach((service) => {
      endDate.setMinutes(endDate.getMinutes() + service.duration);
    });

    // VERIFICAR CONFLITO DE HORÁRIO
    const conflict = await prisma.appointment.findFirst({
      where: {
        barbershopId,
        status: "scheduled",
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    if (conflict) {
      return res.status(400).json({
        error: "Já existe um agendamento nesse horário",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: startDate,
        clientId: clientId,
        barbershopId,
        status: "scheduled",
        services: {
          connect: services.map((service) => ({ id: service.id })), // Conectando múltiplos serviços
        },
      },
      include: {
        client: true,
        services: true, // Incluindo os serviços no retorno
      },
    });

    // ENVIAR WHATSAPP
    if (appointment.client?.phone) {
      const formattedDate = startDate.toLocaleString("pt-BR");

      const message = `Olá ${appointment.client.name} 👋

Seu horário foi confirmado!

📅 ${formattedDate}
💈 ${appointment.services.map((s) => s.name).join(", ")}

Obrigado por agendar com a gente! 💈`;

      await sendWhatsappMessage(appointment.client.phone, message);
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Erro createAppointment:", error);
    res.status(500).json({
      error: "Erro ao criar agendamento",
    });
  }
};

// ATUALIZAR AGENDAMENTO
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, price, serviceIds } = req.body; // Adicionando serviceIds na atualização

    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
      include: {
        client: true,
        services: true, // Incluindo os serviços
      },
    });

    if (!appointment) {
      return res.status(404).json({
        error: "Agendamento não encontrado",
      });
    }

    // Verificando se os novos serviços existem
    if (serviceIds && serviceIds.length > 0) {
      const services = await prisma.service.findMany({
        where: {
          id: {
            in: serviceIds,
          },
        },
      });

      if (services.length !== serviceIds.length) {
        return res.status(404).json({
          error: "Alguns serviços não encontrados",
        });
      }

      // Atualizando os serviços
      await prisma.appointment.update({
        where: { id: Number(id) },
        data: {
          serviceIds: {
            set: services.map((service) => ({ id: service.id })), // Atualizando a lista de serviços
          },
        },
      });
    }

    const updated = await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        status,
        price,
      },
    });

    // WHATSAPP CANCELAMENTO
    if (status === "cancelled" && appointment.client?.phone) {
      const message = `Olá ${appointment.client.name} 👋

Seu horário foi cancelado.

Se quiser reagendar, estamos à disposição!`;

      await sendWhatsappMessage(appointment.client.phone, message);
    }

    // WHATSAPP FINALIZAÇÃO
    if (status === "done" && appointment.client?.phone) {
      const message = `Obrigado pela visita ${appointment.client.name} ✂️

Esperamos te ver novamente em breve!

Barbearia PH 💈`;

      await sendWhatsappMessage(appointment.client.phone, message);
    }

    res.json(updated);
  } catch (error) {
    console.error("Erro updateAppointment:", error);
    res.status(500).json({
      error: "Erro ao atualizar agendamento",
    });
  }
};

// DELETAR AGENDAMENTO
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "ID do agendamento não informado",
      });
    }

    console.log("ID recebido:", id);

    await prisma.appointment.delete({
      where: {
        id: id,
      },
    });

    res.json({
      message: "Agendamento deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro deleteAppointment:", error);

    res.status(500).json({
      error: "Erro ao deletar agendamento",
    });
  }
};

// FATURAMENTO DO DIA
exports.getTodayRevenue = async (req, res) => {
  try {
    const barbershopId = req.user.barbershopId;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        barbershopId,
        status: "done",
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const total = appointments.reduce((sum, a) => {
      return sum + (a.price || 0);
    }, 0);

    res.json({
      total,
      count: appointments.length,
    });
  } catch (error) {
    console.error("Erro getTodayRevenue:", error);
    res.status(500).json({
      error: "Erro ao calcular faturamento",
    });
  }
};

// AGENDA DO DIA
exports.getTodayAppointments = async (req, res) => {
  try {
    const barbershopId = req.user.barbershopId;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        barbershopId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        client: true,
        services: true, // Incluindo os múltiplos serviços
      },
      orderBy: {
        date: "asc",
      },
    });

    res.json(appointments);
  } catch (error) {
    console.error("Erro getTodayAppointments:", error);
    res.status(500).json({
      error: "Erro ao buscar agenda",
    });
  }
};
