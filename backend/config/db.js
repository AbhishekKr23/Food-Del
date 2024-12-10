import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://abhi:abhi@cluster0.46yf8.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}