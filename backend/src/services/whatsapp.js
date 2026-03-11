const axios = require("axios");

const API_URL = process.env.EVOLUTION_API_URL;
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE = process.env.EVOLUTION_INSTANCE;

async function sendWhatsappMessage(phone, message) {
  try {
    // Valida o número de telefone
    if (!phone || !message) {
      throw new Error("O número de telefone e a mensagem são obrigatórios.");
    }

    // Valida o formato do número de telefone (apenas números)
    const formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.length < 10) {
      throw new Error("Número de telefone inválido.");
    }

    const number = formattedPhone + "@s.whatsapp.net";

    console.log("📤 Enviando mensagem...");
    console.log("Número:", number);

    const response = await axios.post(
      `${API_URL}/message/sendText/${INSTANCE}`,
      {
        number,
        text: message,
      },
      {
        headers: {
          apikey: API_KEY,
        },
      }
    );

    console.log("✅ Mensagem enviada:", response.data);
  } catch (error) {
    // Log de erro aprimorado
    console.error("🚨 Erro ao enviar mensagem:", error.message);
    throw new Error(`Falha ao enviar mensagem: ${error.message}`);
  }
}

module.exports = { sendWhatsappMessage };
