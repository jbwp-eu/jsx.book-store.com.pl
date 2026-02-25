import dotenv from "dotenv";
import colors from "colors";
import { Product } from "./models/productModel.js";
import { User } from "./models/userModel.js";
import { Order } from "./models/orderModel.js";

import products from "./products.js";
import users from "./users.js";
import { connectDB } from "./config/db.js";

dotenv.config();

/**
 * Restores DB to seeded state: deletes all User, Product, Order;
 * inserts users and products from users.js and products.js.
 * Does not connect DB or exit process (caller must be connected).
 */
export const seedData = async () => {
  await User.deleteMany();
  await Product.deleteMany();
  await Order.deleteMany();

  const createdUsers = await User.insertMany(users);
  const adminUser = createdUsers[0]._id;

  const sampleProducts = products.map((product) => {
    return { ...product, user: adminUser };
  });

  await Product.insertMany(sampleProducts);
};

const importData = async () => {
  try {
    await connectDB();
    console.log("User & Product & Order data destroyed".red.inverse);
    await seedData();
    console.log("User & Product data imported".blue.inverse);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
}

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Products data destroyed");
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === "-d") {
  destroyData();
}
