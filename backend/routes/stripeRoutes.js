import express from "express";

import Stripe from "stripe";

import { sendPurchaseReceipt } from "../utils/purchaseReceipt.js";

import { Order } from "../models/orderModel.js";

import { t } from "../utils/translate.js";

const router = express.Router();

const DEFAULT_LANGUAGE = "PL";

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

      if (event.type === "charge.succeeded") {
        const { object } = event.data;

        const order = await Order.findById(object.metadata.orderId);

        if (!order) {
          res.status(404);
          throw new Error(t(language, "order.notFound"));
        }

        const paidCorrectAmount =
          order.totalPrice.toFixed(2) === (object.amount / 100).toFixed(2);
        if (!paidCorrectAmount) {
          res.status(401);
          throw new Error(t(language, "order.incorrectAmount"));
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: object.id,
          status: "COMPLETED",
          update_time: object.created,
          email_address: object.billing_details.email,
        };

        const updatedOrder = await order.save();

        if (!updatedOrder) {
          res.status(401);
          throw new Error(t(language, "order.notFound"));
        }

        await sendPurchaseReceipt(updatedOrder.id, language, res, next);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
