import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";

dotenv.config();

import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";

import { connectDB } from "./config/db.js";

import Stripe from "stripe";

import { languageMiddleware } from "./middleware/languageMiddleware.js";
import { t } from "./utils/translate.js";

const port = process.env.PORT || 3002;

connectDB();

const app = express();

app.use("/api/webhooks", stripeRoutes);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(languageMiddleware);

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

app.post("/api/create-payment-intent", async (req, res, next) => {
  try {
    const { id, amount } = req.body;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST_MODE);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "pln",
      metadata: { orderId: id },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    next(err);
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running (development mode)");
  });
}

app.use((req, res, next) => {
  const error = new Error(`Could not find this route = ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const language = req?.query?.language;

  let statusCode = res.statusCode
    ? res.statusCode === 200
      ? 500
      : res.statusCode
    : 500;

  const message =
    err.message || t(language, "errors.unknown");
  res.status(statusCode).json({ message });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
