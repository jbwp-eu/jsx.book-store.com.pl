import dotenv from "dotenv";
import colors from "colors";
import { Product } from "./models/productModel.js";
import { User } from "./models/userModel.js";
import { Order } from "./models/orderModel.js";

import products from "./products.js";
import users from "./users.js";
import { connectDB } from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log("User & Product & Order data destroyed".red.inverse);

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log("User & Product data imported".blue.inverse);

    process.exit();
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
