import axios from "axios";
import express from "express";
import { MercadoPagoConfig, Payment } from 'mercadopago'; 
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Configurações essenciais
app.use(cors());
app.use(express.json());

// Configurar cliente do Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.KEYMP 
});

// Rota para obter informações de pagamento
app.get("/api/getpayment", async (req, res) => {
  try {
    const payment = await new Payment(client).get({ 
      id: req.headers.paymentid 
    });
    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pagamento" });
  }
});

// Rota para criar pagamento
app.post("/api/create_preference", async (req, res) => {
  try {
    const paymentData = {
      transaction_amount: req.body.amount,
      currency: "BRL",
      description: req.body.description,
      payment_method_id: req.body.paymentMethodId,
      payer: {
        email: req.body.email
      }
    };

    const response = await new Payment(client).create({ body: paymentData });
    
    res.status(201).json({
      id: response.id,
      ticket_url: response.point_of_interaction?.transaction_data?.ticket_url
    });
    
  } catch (error) {
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
      
      const payment = await new Payment(client).get({ id: paymentId });
      
      if (payment.status === "approved") {
        console.log("Pagamento aprovado:", payment);
        // Adicione sua lógica aqui
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