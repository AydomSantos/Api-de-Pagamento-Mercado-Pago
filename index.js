import axios from "axios";
import express from "express";
import mercadopago from "mercadopago";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Configurações essenciais
app.use(cors());
app.use(express.json());

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.KEYMP
});

// Rota para obter informações de pagamento
app.get("/api/getpayment", async (req, res) => {
  try {
    const payment = await mercadopago.payment.get(req.headers.paymentid);
    res.status(200).json(payment.response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pagamento" });
  }
});

// Rota para criar pagamento
app.post("/api/createpayment", async (req, res) => { 
  try {
    const paymentData = {
      transaction_amount: req.body.amount,
      currency: "BRL", 
      description: req.body.description,
      payment_method_id: req.body.paymentMethodId,
      external_reference: req.body.externalReference,
      installments: req.body.installments || 1,
      payer: { 
        email: req.body.email 
      }
    };

    const response = await mercadopago.payment.create(paymentData);
    
    res.status(201).json({
      ticket_url: response.body.point_of_interaction?.transaction_data?.ticket_url,
      payment_id: response.body.id
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: error.message,
      details: error.cause 
    });
  }
});

// Webhook
app.post("/webhook", async (req, res) => { 
  try {
    if (req.body.action === "payment.updated") {
      const paymentId = req.body.data.id;
      
      const payment = await mercadopago.payment.get(paymentId);
      
      if (payment.response.status === "approved") {
        console.log("Pagamento aprovado:", payment);
      }
    }
    res.status(200).end();
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.status(500).end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});