import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Configuração inicial
const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Mercado Pago
console.log('Token carregado:', process.env.MP_ACCESS_TOKEN ? 'Sim' : 'Não');
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

const payment = new Payment(client);

// Rota para processamento de pagamento
app.post('/process-payment', async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body);

    // Validação básica
    if (!req.body.paymentMethodId || !req.body.payerEmail) {
      console.log('Validação falhou:', { 
        paymentMethodId: !!req.body.paymentMethodId, 
        payerEmail: !!req.body.payerEmail 
      });
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Montagem do payload
    const paymentData = {
      transaction_amount: req.body.amount || 0,
      description: req.body.description || 'Pagamento via Loja',
      payment_method_id: req.body.paymentMethodId,
      payer: {
        email: req.body.payerEmail,
        ...(req.body.payerId && { id: req.body.payerId })
      },
      ...(req.body.token && { token: req.body.token })
    };

    console.log('Payment Data:', paymentData);

    // Criação do pagamento
    const result = await payment.create({ body: paymentData });
    console.log('Resposta do Mercado Pago:', result);
    
    // Resposta formatada
    res.status(201).json({
      success: true,
      payment_id: result.id,
      status: result.status,
      ...(result.point_of_interaction && {
        qr_code: result.point_of_interaction.transaction_data.qr_code,
        ticket_url: result.point_of_interaction.transaction_data.ticket_url
      })
    });

  } catch (error) {
    console.error('Erro detalhado:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao processar pagamento'
    });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando na porta ${PORT}`);
});