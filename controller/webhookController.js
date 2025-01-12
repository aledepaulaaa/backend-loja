const Webhook = require("../models/Webhook");
const verificationToken = process.env.VERIFICATION_TOKEN;

const webhookConnection = async (req, res) => {
    console.log("Recebendo verificação do webhook...", req.params);
    res.status(200).json({ Key: verificationToken });
};

const webhookEvents = async (req, res) => {
    const receivedToken = req.headers['verification-token']; // Verificar o token nos headers
    if (receivedToken !== verificationToken) {
        return res.status(401).json({ message: "Token de verificação inválido." });
    }

    const data = req.body;
    switch (data.EventTypeId) {
        case 1796: // Transaction Payment Created
            console.log("O pagamento do cliente foi efetuado com sucesso: ", data);

            const newWebhook = new Webhook(data);
            try {
                await newWebhook.save();
                console.log("Evento de pagamento salvo com sucesso: ", newWebhook);
            } catch (error) {
                console.error("Erro ao salvar evento de pagamento: ", error);
            }
            break;

        case 1797: // Transaction Reversal Created
            console.log("Um reembolso do cliente foi efetuado com sucesso: ", data);
            break;
        case 1798: // Transaction Payment Failed
            console.log("O pagamento de um cliente falhou: ", data);
            break;
        default:
            console.log("Evento desconhecido: ", data);
            break;
    }

    res.status(200).json({ message: "Webhook recebido com sucesso." });
};

module.exports = { webhookEvents, webhookConnection };
