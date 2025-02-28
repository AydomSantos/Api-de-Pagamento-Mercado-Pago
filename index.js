import axios from "axios";
import express from "express";
import { MercadoPagoConfig, Payment } from 'mercadopago'; 
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// 1. Configurações melhoradas
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'http://localhost:3000' 
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT']
}));

app.use(express.json());

// 2. Configuração segura do Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.KEYMP,
  options: { timeout: 5000 }
});

// 3. Health Check para monitoramento
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// 4. Rota de pagamento com validação
app.post("/api/create_preference", async (req, res) => {
  try {
    // Validação básica
    if (!req.body.amount || !req.body.email) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const paymentData = {
      transaction_amount: Number(req.body.amount),
      currency: "BRL",
      description: req.body.description || "Pagamento genérico",
      payment_method_id: req.body.paymentMethodId || "pix",
      payer: {
        email: req.body.email
      }
    };

    const response = await new Payment(client).create({ body: paymentData });
    
    res.status(201).json({
      id: response.id,
      ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
      qr_code: response.point_of_interaction?.transaction_data?.qr_code_base64
    });
    
  } catch (error) {
    console.error('Erro no pagamento:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.cause?.code
    });
  }
});

// 5. Webhook otimizado
app.post("/webhook", async (req, res) => {
  try {
    if (req.body.action === "payment.updated") {
      const paymentId = req.body.data.id;
      
      // Processamento assíncrono
      processPayment(paymentId).catch(console.error);
    }
    res.status(200).end();
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.status(500).end();
  }
});

// Função auxiliar para processar pagamentos
async function processPayment(paymentId) {
  try {
    const payment = await new Payment(client).get({ id: paymentId });
    if (payment.status === "approved") {
      console.log("Pagamento aprovado:", payment.id);
      // Implementar lógica de negócio aqui
    }
  } catch (error) {
    console.error("Erro no processamento:", error);
  }
}

// 6. Configuração de porta segura
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});