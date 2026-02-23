import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zxmxrrl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)

    console.log(`MongoDB connected:${conn.connection.host}`)
  }
  catch (err) {
    console.log(`Error:${err.message}`);
    process.exit(1);
  }
}