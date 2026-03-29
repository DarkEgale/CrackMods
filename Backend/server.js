import dotenv from "dotenv";
dotenv.config(); // এটি সবার উপরেই থাকবে

import app from "./app.js";
import connectDB from "./config/db.js";

// ডাটাবেস কানেক্ট করুন
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});