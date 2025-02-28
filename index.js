import axios from "axios";
import express from "express";
import { MercadoPagoConfig, Payment } from 'mercadopago'; 
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// 1. Configuração dinâmica de CORS
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://seu-frontend.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origem (ex.: ferramentas de teste ou chamadas server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// 2. Middleware para headers de segurança
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// 3. Parser para JSON
app.use(express.json());

// 4. Configuração do Mercado Pago com validação
if (!process.env.KEYMP) {
  console.error('Erro: KEYMP não definida nas variáveis de ambiente');
  process.exit(1);
}

const client = new MercadoPagoConfig({ 
  accessToken: process.env.KEYMP,
  options: { 
    timeout: 5000,
    idempotencyKey: process.env.IDEMPOTENCY_KEY 
  }
});

const processPaymentQueue = {
  add: (paymentId) => {
    console.log(`Pagamento enfileirado: ${paymentId}`);
   
  }
};

// 5. Health Check melhorado
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'API de Pagamentos'
  });
});

// 6. Rota de criação de preferência com validação completa
app.post("/api/create_preference", async (req, res) => {
  try {
    // Validação dos dados
    const requiredFields = ['amount', 'email'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando',
        missing: missingFields
      });
    }

    // Construção segura do payload
    const paymentData = {
      transaction_amount: Number(req.body.amount),
      currency: "BRL",
      description: req.body.description?.substring(0, 255) || "Pagamento genérico",
      payment_method_id: ['pix', 'bolbradesco'].includes(req.body.paymentMethodId) 
        ? req.body.paymentMethodId 
        : 'pix',
      payer: {
        email: req.body.email,
        identification: req.body.identification ? {
          type: req.body.identification.type || 'CPF',
          number: req.body.identification.number
        } : undefined
      }
    };

    // Criação da preferência de pagamento
    const response = await new Payment(client).create({ 
      body: paymentData,
      requestOptions: {
        idempotencyKey: req.headers['x-idempotency-key']
      }
    });
    
    res.status(201).json({
      id: response.id,
      status: response.status,
      payment_method: response.payment_method_id,
      ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
      qr_code: response.point_of_interaction?.transaction_data?.qr_code_base64,
      expiration_date: response.date_of_expiration
    });
    
  } catch (error) {
    console.error('Erro no pagamento:', error);
    const statusCode = error.status || 500;
    res.status(statusCode).json({ 
      error: error.message,
      code: error.cause?.code,
      details: error.cause?.data
    });
  }
});

// 7. Webhook com validação de origem
app.post("/webhook", async (req, res) => {
  try {
    // Verificação básica de origem via header secreto
    const validOrigin = req.headers['x-webhook-secret'] === process.env.WEBHOOK_SECRET;
    
    if (!validOrigin) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    if (req.body.action === "payment.updated") {
      const paymentId = req.body.data.id;
      
      // Processamento assíncrono com fila
      processPaymentQueue.add(paymentId);
    }
    
    res.status(200).end();
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.status(500).json({ 
      error: error.message,
      requestId: req.headers['x-request-id']
    });
  }
});

// 8. Configuração da porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🛡️ Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Origens permitidas: ${allowedOrigins.join(', ')}`);
  console.log(`🔑 Modo: ${process.env.NODE_ENV || 'development'}`);
});
