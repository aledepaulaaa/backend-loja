const Webhook = require("../models/Webhook");
const OrderCustomizado = require("../models/OrderCustomizado");
const verificationToken = process.env.VERIFICATION_TOKEN;

const webhookConnection = async (req, res) => {
    console.log("Recebendo verificação do webhook...", req.params);
    res.status(200).json({ Key: verificationToken });
};

const webhookEvents = async (req, res) => {
    const data = req.body;
    console.log("Webhook recebido: ", data);

    try {
        switch (data.EventTypeId) {
            case 1796: // Transaction Payment Created
                console.log("O pagamento do cliente foi efetuado com sucesso: ", data);
                const newWebhook = new Webhook(data);
                await newWebhook.save();
                console.log("Evento de pagamento salvo com sucesso: ", newWebhook);

                const customerEmail = data.EventData?.Email; // Extrair o email do cliente
                if (customerEmail) {
                    // Encontre a ordem usando o email do cliente e atualize o status
                    const updatedOrder = await OrderCustomizado.findOneAndUpdate(
                        { "customer.email": customerEmail },
                        { status: "Pago" },
                        { new: true } // Retorna o documento atualizado
                    );

                    if (updatedOrder) {
                        console.log(`Status da ordem ${updatedOrder._id} atualizado para Pago`);
                    } else {
                        console.log(`Nenhuma ordem encontrada com o email: ${customerEmail}`);
                    }
                } else {
                    console.log("Email do cliente não encontrado no webhook data.");
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

    } catch (error) {
        console.error("Erro ao processar webhook: ", error);
        res.status(500).json({ message: "Erro ao processar webhook" });
    }
};

module.exports = { webhookEvents, webhookConnection };
