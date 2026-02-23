import nodemailer from "nodemailer";
import { Order } from "../models/orderModel.js";
import { t } from "./translate.js";

export const sendPurchaseReceipt = async (
  updatedOrderId,
  language,
  res,
  next
) => {
  try {
    const updatedOrder = await Order.findById(updatedOrderId).populate("user");

    const date = new Date().toLocaleString();

    if (!updatedOrder) {
      res.status(404).json({
        message: t(language, "order.notFound"),
      });
      return;
    }

    let host = process.env.SMTP_HOST;
    let port = process.env.SMTP_PORT || 465;
    let user = process.env.SMTP_USER;
    let password = process.env.SMTP_PASSWORD;
    let domain = process.env.DOMAIN;

    let to_1 = updatedOrder.user.email;
    let to_3 = process.env.TO_3;

    let transporter = nodemailer.createTransport({
      host: host,
      port: port,
      // secure: false,
      requireTLS: true,
      auth: {
        user: user,
        pass: password,
      },
    });

    let from = `"BookStore" <jsx@${domain}>`;

    let to = `<${to_1}>,<${to_3}>`;

    let subject = t(language, "receipt.subject");

    const { id, totalPrice, itemsPrice, shippingPrice } = updatedOrder;

    const info = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: `<head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Purchase Receipt</title>
                <style>
                  h2 {
                    color: gray;
                  }
                  section {
                    padding: 5px;
                  }
                  table {
                    width: 90%;
                    }
                  th {
                    font-weight: 400;
                    text-align: left;
                    color: grey;
                  }
                  td {
                    font-weight: 300;
                    color: grey;
                    text-align: right;
                  }
                  tr {
                    justify-content: space-between;
                  }
                  #totalPrice {
                    font-weight: 700;
                  }
                </style>
            </head>
            <body>
              <section>
                <h2>${t(language, "receipt.title")}</h2>
                <table>
                  <tr>
                    <th>${t(language, "receipt.orderId")}</th>
                    <td>...${id.substring(id.length - 6)}</td>
                  </tr>
                  <tr>
                    <th>${t(language, "receipt.purchaseDate")}</th>
                    <td>${date}</td>
                  </tr>
                  <tr>
                    <th>${t(language, "receipt.items")}</th>
                    <td>${itemsPrice} PLN</td>
                  </tr>
                  <tr>
                    <th>${t(language, "receipt.shipping")}</th>
                    <td>${shippingPrice.toFixed(2)} PLN</td>
                  </tr>
                  <tr>
                    <th>${t(language, "receipt.paid")}</th>
                    <td id="totalPrice">${totalPrice} PLN</td>
                  </tr>
                </table>
              </section>
            </body>`,
    });

    console.log("Sent message id: %s", info.messageId);

    res.status(201).json({
      message: t(language, "receipt.paymentSuccessful"),
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};
