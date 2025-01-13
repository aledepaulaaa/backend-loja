const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        customerTrns: {
            type: String,
            required: false,
        },
        customer: {
            email: { type: String, required: false },
            fullName: { type: String, required: false },
            phone: { type: String, required: false },
            countryCode: { type: Number, required: false },
            requestLang: { type: String, required: false },
        },
        dynamicDescriptor: {
            type: String,
            required: false,
        },
        currencyCode: {
            type: Number,
            required: true,
        },
        paymentTimeout: {
            type: Number,
            required: false,
        },
        preauth: {
            type: Boolean,
            required: false,
        },
        allowRecurring: {
            type: Boolean,
            required: false,
        },
        maxInstallments: {
            type: Number,
            required: false,
        },
        merchantTrns: {
            type: String,
            required: false,
        },
        paymentNotification: {
            type: Boolean,
            required: false,
        },
        tipAmount: {
            type: Number,
            required: false,
        },
        disableExactAmount: {
            type: Boolean,
            required: false,
        },
        disableCash: {
            type: Boolean,
            required: false,
        },
        disableWallet: {
            type: Boolean,
            required: false,
        },
        sourceCode: {
            type: String,
            required: false,
        },
        tags: {
            type: [String],
            required: false,
        },
        paymentMethodFees: {
            paymentMethodId: {
                type: String,
                required: false,
            },
            fee: {
                type: Number,
                required: false,
            },
        },
        cardTokens: {
            type: [String],
            required: false,
        },
        isCardVerification: {
            type: Boolean,
            required: false,
        },
        nbgLoanOrderOptions: {
            Code: {
                type: String,
                required: false,
            },
            ReceiptType: {
                type: Number,
                required: false,
            },
        },
        klarnaOrderOptions: {
            attachment: {
                body: { type: String, required: false },
                contentType: { type: String, required: false },
            },
            billingAddress: {
                city: { type: String, required: false },
                email: { type: String, required: false },
                phone: { type: String, required: false },
                title: { type: String, required: false },
                region: { type: String, required: false },
                country: { type: String, required: false },
                givenName: { type: String, required: false },
                familyName: { type: String, required: false },
                postalCode: { type: String, required: false },
                streetAddress: { type: String, required: false },
                streetAddress2: { type: String, required: false },
            },
            shippingAddress: {
                city: { type: String, required: false },
                email: { type: String, required: false },
                region: { type: String, required: false },
                phone: { type: String, required: false },
                country: { type: String, required: false },
                givenName: { type: String, required: false },
                familyName: { type: String, required: false },
                postalCode: { type: String, required: false },
                streetAddress: { type: String, required: false },
                streetAddress2: { type: String, required: false },
            },
            orderLines: [
                {
                    name: { type: String, required: false }, // Mudado para String
                    type: { type: String, required: false },
                    taxRate: { type: Number, required: false },
                    quantity: { type: Number, required: false }, // Mudado para Number
                    unitPrice: { type: Number, required: false }, // Mudado para Number
                    imageUrl: { type: String, required: false },// Mudado para String
                    reference: { type: String, required: false },
                    totalAmount: { type: Number, required: false }, // Mudado para Number
                    productUrl: { type: String, required: false },
                    merchantData: { type: String, required: false },
                    quantityUnit: { type: String, required: false },
                    totalTaxAmount: { type: Number, required: false },
                    totalDiscountAmount: { type: Number, required: false },
                    subscription: {
                        name: { type: String, required: false },
                        interval: { type: String, required: false },
                        intervalCount: { type: Number, required: false },
                    },
                    productIdentifiers: {
                        size: { type: String, required: false },
                        brand: { type: String, required: false },
                        color: { type: String, required: false },
                        categoryPath: { type: String, required: false },
                        globalTradeItemNumber: { type: String, required: false },
                        manufacturerPartNumber: { type: String, required: false },
                    },
                },
                {
                    name: { type: String, required: false }, // Mudado para String
                    quantity: { type: Number, required: false }, // Mudado para Number
                    unit_price: { type: Number, required: false }, // Mudado para Number
                    tax_rate: { type: Number, required: false },
                    total_amount: { type: Number, required: false }, // Mudado para Number
                    total_discount_amount: { type: Number, required: false },
                    total_tax_amount: { type: Number, required: false },
                    product_url: { type: String, required: false }, // Mudado para String
                    image_url: { type: String, required: false },// Mudado para String
                }
            ],
        },
        status: {
            type: String,
            enum: ["Pendente", "Pago", "Cancelado"],
            default: "Pendente",
        },
    },
    {
        timestamps: true,
    }
);

const OrderCustomizado = mongoose.model(
    "Order",
    orderSchema.plugin(AutoIncrement, {
        inc_field: "invoice",
        start_seq: 10000,
    })
);
module.exports = OrderCustomizado;