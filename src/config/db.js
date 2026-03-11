import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // exit the process with failure so the app doesn't run without a DB
    process.exit(1);
  }
};

export default connectDB;
