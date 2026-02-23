import mongoose from "mongoose";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";

import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";
import { sendPurchaseReceipt } from "../utils/purchaseReceipt.js";

export const addOrderItems = async (req, res, next) => {
  const sess = await mongoose.startSession();

  sess.startTransaction();

  try {
    let { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);

      throw new Error(req.t("order.noItems"));
    } else {
      const itemsFromDB = await Product.find({
        _id: { $in: orderItems.map((x) => x.id) },
      });

      const dbOrderItems = orderItems.map((itemFromClient) => {
        const matchingItemFromDB = itemsFromDB.find(
          (itemFromDB) => itemFromDB._id.toString() === itemFromClient.id
        );

        if (!matchingItemFromDB) {
          res.status(401);
          throw new Error(req.t("order.verifyPaymentFailed"));
        }
        return {
          ...itemFromClient,
          product: itemFromClient.id,
          price: matchingItemFromDB.price,
          _id: undefined,
        };
      });

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrices(dbOrderItems);

      const order = new Order({
        user: req.user.id,
        orderItems: dbOrderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      const createdOrder = await order.save({ session: sess });

      for (const item of createdOrder.orderItems) {
        const product = await Product.findById(item.product);

        if (product.countInStock - item.qty < 0) {
          throw new Error(req.t("order.quantityExceedsStock", { title: item.title }));
        }
        const query = {
          $inc: { countInStock: -item.qty },
        };
        await Product.findByIdAndUpdate(item.product, query, {
          new: true,
        }).session(sess);
      }

      await sess.commitTransaction();

      res.status(201).json({
        createdOrder: createdOrder.toObject({ getters: true }),
        message: req.t("order.created"),
      });
    }
  } catch (err) {
    await sess.abortTransaction();

    next(err);
  } finally {
    sess.endSession();
  }
};

export const getOrderById = async (req, res, next) => {
  const { id } = req.params;

  try {
    let order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      res.status(404);
      throw new Error(req.t("order.notFound"));
    }
    res.json(order.toObject({ getters: true }));
  } catch (err) {
    next(err);
  }
};

export const updateOrderToPaid = async (req, res, next) => {
  try {
    const data = await verifyPayPalPayment(req.body.id, req, res, next);

    console.log("data:", data);

    if (!data) {
      return;
    }

    const { verified, value } = data;

    if (!verified) {
      res.status(401);
      throw new Error(req.t("order.paymentNotVerified"));
    }

    const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);

    if (!isNewTransaction) {
      res.status(401);
      throw new Error(req.t("order.transactionUsed"));
    }
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error(req.t("order.notFound"));
    }

    const paidCorrectAmount = order.totalPrice.toFixed(2) === value;
    if (!paidCorrectAmount) {
      res.status(401);
      throw new Error(req.t("order.incorrectAmount"));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    if (!updatedOrder) {
      res.status(401);
      throw new Error(req.t("order.notFound"));
    }

    await sendPurchaseReceipt(updatedOrder.id, req.language, res, next);
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    let orders = await Order.find({ user: req.user.id });
    if (!orders) {
      res.status(404);
      throw new Error(req.t("order.couldNotFindAny"));
    }
    res.json(orders.map((order) => order.toObject({ getters: true })));
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    let orders = await Order.find({}).populate("user", "id name");

    if (!orders) {
      res.status(404);
      throw new Error(req.t("order.couldNotFindAny"));
    }
    res.json(orders.map((order) => order.toObject({ getters: true })));
  } catch (err) {
    next(err);
  }
};

export const updateOrderToDelivered = async (req, res, next) => {
  const { id } = req.params;

  try {
    let order = await Order.findById(id);

    if (!order) {
      res.status(404);
      throw new Error(req.t("order.notFound"));
    }
    order.isDelivered = true;
    order.deliveredAt = new Date().toUTCString();

    await order.save();

    res.json({
      message: req.t("order.markedDelivered"),
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    let order = await Order.findById(id);

    if (!order) {
      res.status(404);
      throw new Error(req.t("order.notFound"));
    }
    await order.deleteOne();

    res.json({
      message: req.t("order.deleted"),
    });
  } catch (err) {
    next(err);
  }
};
