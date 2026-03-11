const QRCode = require("qrcode");

/**
 * Função para gerar o QR Code com as credenciais necessárias.
 * @param {string} apiUrl - URL da API Evolution.
 * @param {string} apiKey - Chave da API.
 * @param {string} instanceId - ID da instância da Evolution API.
 * @param {string} clientPhone - Número de telefone do cliente.
 * @returns {string} - URL do QR Code gerado em formato base64.
 */
const generateQRCode = async (apiUrl, apiKey, instanceId, clientPhone) => {
  // Validação dos parâmetros de entrada
  if (!apiUrl || !apiKey || !instanceId || !clientPhone) {
    throw new Error(
      "Todos os parâmetros (apiUrl, apiKey, instanceId, clientPhone) são obrigatórios"
    );
  }

  const qrData = {
    apiUrl,
    apiKey,
    instanceId,
    clientPhone,
  };

  try {
    // Gerando o QR Code em formato de URL de imagem base64
    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));
    return qrCodeUrl; // Retorna o QR Code em formato base64
  } catch (error) {
    // Logando o erro com mais detalhes
    console.error("Erro ao gerar o QR Code:", error.message);
    console.error("Dados recebidos:", qrData); // Mostra os dados que estavam sendo processados
    throw new Error(`Falha ao gerar QR Code: ${error.message}`);
  }
};

module.exports = { generateQRCode };
