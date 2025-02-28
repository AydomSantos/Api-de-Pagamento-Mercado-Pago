import axios from "axios";
import express from "express";
import { Payment } from "mercadopago";

const app = express();
app.use(express.json());

// Rota GET corrigida
app.get("/api/getpayment", async (req, res) => {
  try {
    const payment = new Payment({ accessToken: process.env.KEYMP });
    const information = await payment.get({ id: req.headers.paymentid });
    res.status(200).send({ response: information }); // Resposta dentro da rota
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Erro ao buscar pagamento" });
  }
});

// Rota PUT corrigida
app.put("/api/createpayment", async (req, res) => {
  try {
    const payment = new Payment({ accessToken: process.env.KEYMP });
    const response = await payment.create({
      transaction_amount: {
        currency: "BRL",
        total: req.body.amount,
      },
      description: req.body.description,
      payment_method_id: req.body.paymentMethodId,
      external_reference: req.body.externalReference,
      installments: req.body.installments,
    });

    res.status(200).send({
      response: response.point_of_interaction.transaction_data.ticket_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Erro ao criar pagamento" });
  }
});

// Rota POST corrigida
app.post("/webhook", async (req, res) => { // URL fixa inválida, alterei para "/webhook"
  if (req.body.action === "payment.updated") {
    try {
      const response = await axios.get("/api/getpayment", {
        headers: { paymentid: req.body.data.id }
      });
      
      if (response.data.response.status === "approved") {
        console.log(response.data);
        res.sendStatus(200);
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});