console.log("🚀 Script iniciado");

require("dotenv").config();

const { sendWhatsappMessage } = require("./src/services/whatsapp");

async function run() {
  const phone = "5534991671917";
  const message = "Teste de envio do sistema de agendamento";

  console.log("📤 Enviando mensagem...");
  console.log("Número:", phone);

  await sendWhatsappMessage(phone, message);

  console.log("🏁 Script finalizado");
}

run();
