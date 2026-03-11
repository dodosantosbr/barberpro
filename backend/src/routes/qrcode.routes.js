const express = require("express");
const router = express.Router();
const { generateQRCode } = require("../services/qrcodeService"); // Importa o serviço de geração do QR Code

// Endpoint para gerar o QR Code
router.get("/generate-qr", async (req, res) => {
  const { clientPhone } = req.query; // Número do cliente (passado na query)

  // Verificando se o número do cliente foi fornecido
  if (!clientPhone) {
    return res.status(400).json({ message: "Número do cliente é necessário" });
  }

  // Pegando as credenciais da Evolution API do arquivo de variáveis de ambiente
  const apiUrl = process.env.EVOLUTION_API_URL; // URL da API Evolution
  const apiKey = process.env.EVOLUTION_API_KEY; // Chave da API
  const instanceId = process.env.EVOLUTION_INSTANCE; // ID da instância

  try {
    // Gerando o QR Code com as informações fornecidas
    const qrCodeUrl = await generateQRCode(
      apiUrl,
      apiKey,
      instanceId,
      clientPhone
    );
    // Retornando a URL do QR Code gerado em formato base64
    res.json({ qrCodeUrl });
  } catch (error) {
    // Se ocorrer um erro ao gerar o QR Code, envia a mensagem de erro
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
