const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const controller = require("../controllers/appointmentController");
const { sendWhatsappMessage } = require("../services/whatsapp");

// Listar agendamentos
router.get("/", auth, controller.listAppointments);

// Criar agendamento
router.post("/", auth, controller.createAppointment);

// Atualizar agendamento
router.put("/:id", auth, controller.updateAppointment);

// Deletar agendamento
router.delete("/:id", auth, controller.deleteAppointment);

module.exports = router;
