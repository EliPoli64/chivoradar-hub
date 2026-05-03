import mongoose from "mongoose";

const connectionString = process.env.CONN_STRING || "mongodb://localhost:27017/loudmap";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(connectionString);
    isConnected = true;
  } catch (error){
    console.error("Error al conectar a la DB: ", error);
  }
}