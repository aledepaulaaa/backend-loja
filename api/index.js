require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const qs = require("qs");
const path = require("path");
const axios = require("axios");
// const http = require("http");
// const { Server } = require("socket.io");

const { connectDB } = require("../config/db");
const productRoutes = require("../routes/productRoutes");
const customerRoutes = require("../routes/customerRoutes");
const adminRoutes = require("../routes/adminRoutes");
const orderRoutes = require("../routes/orderRoutes");
const customerOrderRoutes = require("../routes/customerOrderRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const couponRoutes = require("../routes/couponRoutes");
const attributeRoutes = require("../routes/attributeRoutes");
const settingRoutes = require("../routes/settingRoutes");
const currencyRoutes = require("../routes/currencyRoutes");
const languageRoutes = require("../routes/languageRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const { isAuth, isAdmin } = require("../config/auth");
// const {
//   getGlobalSetting,
//   getStoreCustomizationSetting,
// } = require("../lib/notification/setting");

connectDB();
const app = express();

// We are using this for the express-rate-limit middleware
// See: https://github.com/nfriedly/express-rate-limit
// app.enable('trust proxy');
app.set("trust proxy", 1);

app.use(express.json({ limit: "4mb" }));
app.use(helmet());
app.options("*", cors()); // include before other routes
app.use(cors());

//root route
app.get("/", (req, res) => {
  res.send("App works properly!");
});

//this for route will need for store front, also for admin dashboard
app.use("/api/products/", productRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/coupon/", couponRoutes);
app.use("/api/customer/", customerRoutes);
app.use("/api/order/", isAuth, customerOrderRoutes);
app.use("/api/attributes/", attributeRoutes);
app.use("/api/setting/", settingRoutes);
app.use("/api/currency/", isAuth, currencyRoutes);
app.use("/api/language/", languageRoutes);
app.use("/api/notification/", isAuth, notificationRoutes);

//if you not use admin dashboard then these two route will not needed.
app.use("/api/admin/", adminRoutes);
app.use("/api/orders/", orderRoutes);

// Endpoint para conexão e ordem de pagamento com viva wallet
app.post("/api/vivawalletpayment", async (req, res) => {
  const data = req.body
  console.log("Dados Pagamento: ", data)
  try {
    const clientID = process.env.VIVA_CLIENT_ID
    const clientSecret = process.env.VIVA_CLIENT_SECRET

    const orderPayload = {
      accessToken: data.accessToken,
      amount: data.amount,
      customerTrns: data.customerTrns,
      customer: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        countryCode: data.countryCode,
        requestLang: data.requestLang,
      },
      paymentTimeout: data.paymentTimeout,
      preauth: data.preauth,
      allowRecurring: data.allowRecurring,
      maxInstallments: data.maxInstallments,
      paymentNotification: data.paymentNotification,
      tipAmount: data.tipAmount,
      disableExactAmount: data.disableExactAmount,
      disableCash: data.disableCash,
      disableWallet: data.disableWallet,
      sourceCode: data.sourceCode,
    }

    const response = await axios.post(
      "https://demo-accounts.vivapayments.com/connect/token",
      qs.stringify({ grant_type: "client_credentials" }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString("base64")}`,
      },
    })

    const accessToken = response.data.access_token
    const orderResponse = await axios.post(
      "https://demo-api.vivapayments.com/checkout/v2/orders",
      orderPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    )

    if(orderResponse.status === 200) {
      console.log("Ordem criada no backend: ", orderResponse.data)
      res.status(200).json({
        orderCode: orderResponse.data.orderCode,
        message: "Ordem de pagamento criada com sucesso.",
      })
    } else {
      res.status(400).json({
        error: orderResponse.response?.data || "Erro ao processar o pagamento.",
      })
    }

    // const vivaMerchantID = "671c2305-4704-4a7d-8491-1697ff78c72b"
    // const vivaApiKey = "3x01ep"

    // const response = await axios.post(
    //   "https://demo.vivapayments.com/api/orders",
    //   orderPayload,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Basic ${Buffer.from(`${vivaMerchantID}:${vivaApiKey}`).toString("base64")}`,
    //     },
    //   })

    // console.log("Resposta: ", response)
    // if (response.status === 200) {
    //   res.status(200).json({ orderCode: response.data, message: "Ordem de pagamento criada com sucesso." })
    // } else {
    //   res.status(400).json({
    //     error: error.response?.data || "Erro ao processar o pagamento.",
    //   })
    // }
  } catch (error) {
    console.log("Erro ao fazer pagamento: ", error)
  }
})

// Webhook Viva Wallet
app.post("/api/vivawallet/webhook", async (req, res) => {
  const data = req.body
  switch (data.event) {
    case 1796:
      console.log("O pagamento do cliente foi efetuado com sucesso: ", data)
      break;
    case 1797:
      console.log("Um reembolso do cliente foi efetuado com sucesso: ", data)
      break;
    case 1798:
      console.log("O pagamento de um cliente falhou: ", data)
      break;
    default:
      break;
  }
  console.log("Dados Webhook: ", data)
  res.status(200).json({ message: "Webhook recebido com sucesso." })
})

// Use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

// Serve static files from the "dist" directory
app.use("/static", express.static("public"));

// Serve the index.html file for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

// const server = http.createServer(app);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));