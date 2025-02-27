import axios from "axios";
import express, { response } from "express";
import { Payment } from "mercadopago";
const app = express();
app.use(express.json());

app
  .get("/api/getpayment", async (req, res) => {
    const information = await new Payment({
      accessToken: process.env.KEYMP,
    })
      .get({
        id: req.headers.paymentid,
      })
      .catch(console.log);
  })
  .res.send({ response: information })
  .status(200);

app.put("/api/createpayment", async (req, res) => {
  await new Payment({
    accessToken: process.env.KEYMP,
  })
    .create({
      transaction_amount: {
        currency: "BRL",
        total: req.body.amount,
      },
      description: req.body.description,
      payment_method_id: req.body.paymentMethodId,
      external_reference: req.body.externalReference,
      installments: req.body.installments,
    })
    .then((response) => {
      res
        .send({
          response: response.point_of_interaction.transaction_data.ticket_url,
        })
        .catch(console.log);
    });
});

app.post("https://dealhaven.com.br", async (req, res) => {
  if (req.body.action === "payment.updated") {
    await axios({
      url: "/api/getpayment",
      headers: {
        paymentid: req.body.data.id,
      },
    })
      .then((x) => x.data)
      .then(async (r) => {
        if (r.response.status === "approved") {
          console.log(r);
        }
      })
      .catch(console.log);
  }
});
app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
