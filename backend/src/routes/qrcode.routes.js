const express = require("express");
const router = express.Router();
const { generateQRCode } = require("../services/qrcodeService"); // Importa o serviço de geração do QR Code

// Função para validar o número de telefone
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/; // Exemplo de formato (XX) XXXXX-XXXX
  return phoneRegex.test(phone);
};

// Endpoint para gerar o QR Code
router.get("/generate-qr", async (req, res) => {
  const { clientPhone } = req.query; // Número do cliente (passado na query)

  // Verificando se o número do cliente foi fornecido
  if (!clientPhone) {
    return res.status(400).json({ message: "Número do cliente é necessário" });
  }

  // Validando o formato do número de telefone
  if (!validatePhoneNumber(clientPhone)) {
    return res.status(400).json({
      message:
        "Número de telefone inválido. O formato correto é (XX) XXXXX-XXXX",
    });
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
    console.error("Erro ao gerar QR Code:", error);
    res
      .status(500)
      .json({ message: "Erro ao gerar QR Code. Tente novamente mais tarde." });
  }
});

module.exports = router;
