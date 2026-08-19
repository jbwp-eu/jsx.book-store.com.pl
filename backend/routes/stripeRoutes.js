import express from "express";

import Stripe from "stripe";

import { sendPurchaseReceipt } from "../utils/purchaseReceipt.js";

import { Order } from "../models/orderModel.js";

import { t } from "../utils/translate.js";

const router = express.Router();

const DEFAULT_LANGUAGE = "PL";

async function markOrderPaidFromPaymentIntent(
  paymentIntent,
  language,
  res,
  next
) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) {
    console.warn(
      `[Stripe] payment_intent.succeeded: missing metadata.orderId (pi=${paymentIntent.id})`
    );
    res.status(200).json({ received: true });
    return;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    console.warn(
      `[Stripe] payment_intent.succeeded: order not found (orderId=${orderId}, pi=${paymentIntent.id})`
    );
    res.status(200).json({ received: true });
    return;
  }

  if (order.isPaid) {
    console.log(
      `[Stripe] payment_intent.succeeded: order already paid (orderId=${orderId})`
    );
    res.status(200).json({ received: true });
    return;
  }

  const paidCorrectAmount =
    order.totalPrice.toFixed(2) === (paymentIntent.amount / 100).toFixed(2);
  if (!paidCorrectAmount) {
    res.status(401);
    throw new Error(t(language, "order.incorrectAmount"));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: paymentIntent.id,
    status: "COMPLETED",
    update_time: paymentIntent.created,
    email_address: paymentIntent.receipt_email,
  };

  const updatedOrder = await order.save();

  if (!updatedOrder) {
    res.status(401);
    throw new Error(t(language, "order.notFound"));
  }

  console.log(
    `[Stripe] Order marked paid via payment_intent.succeeded (orderId=${updatedOrder.id}, pi=${paymentIntent.id})`
  );
  await sendPurchaseReceipt(updatedOrder.id, language, res, next);
}

router.post(
  "/stripe",
  express.raw({
    type: "application/json",
  }),
  async (req, res, next) => {
    const language = DEFAULT_LANGUAGE;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST_MODE);
    const signature = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST_MODE;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );

      console.log(`[Stripe] webhook received: ${event.id} (${event.type})`);

      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          await markOrderPaidFromPaymentIntent(
            paymentIntent,
            language,
            res,
            next
          );
          break;
        }
        case "payment_intent.payment_failed":
        case "payment_intent.canceled": {
          const paymentIntent = event.data.object;
          const orderId = paymentIntent.metadata?.orderId;
          const failReason =
            paymentIntent.last_payment_error?.message ?? "n/a";
          console.log(
            `[Stripe] ${event.type}: pi=${paymentIntent.id}, orderId=${orderId ?? "n/a"}, reason=${failReason} — order left unpaid`
          );
          res.status(200).json({ received: true });
          break;
        }
        default: {
          console.log(`[Stripe] Unhandled event type ${event.type}`);
          res.status(200).json({ received: true });
          break;
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
