import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected`);
  } catch (error: any) {
    console.log(error);
    process.exit(1);
  }
};
connectDB();

export default connectDB;
