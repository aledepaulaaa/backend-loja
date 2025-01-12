require("dotenv").config();
const express = require("express");
const router = express.Router();
const { webhookEvents, webhookConnection } = require("../controller/webhookController");
const { createPaymentOrder } = require("../controller/pagamentoController");

// Rota para verificação do webhook
router.post("/connection", webhookConnection)

// Rota para receber notificações de eventos
router.post("/events", webhookEvents)

// Endpoint para conexão e ordem de pagamento com viva wallet
router.post("/payment",  createPaymentOrder)


module.exports = router;