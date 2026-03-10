const axios = require("axios");

const API_URL = process.env.EVOLUTION_API_URL;
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE = process.env.EVOLUTION_INSTANCE;

async function sendWhatsappMessage(phone, message) {
  const number = phone.replace(/\D/g, "") + "@s.whatsapp.net";

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
}

module.exports = { sendWhatsappMessage };
