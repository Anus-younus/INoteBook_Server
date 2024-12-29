import mongoose from "mongoose";

export default async function ConnectDb() {
    try {
        const MONGO_URL = process.env.MONGO_URL
        await mongoose.connect(MONGO_URL)
        console.log("Connection succesfull")
    } catch (e) {
        console.log("Connection error")
    }
}