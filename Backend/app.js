import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"; 
import authRouter from './Routes/authRouter.js';
import adminroutes from './Routes/AdminRoutes/adminroutes.js'

const app = express();

// --- Middlewares ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true                
}));
app.use(morgan('dev'));

// Static Folder for File Uploads
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- Routes ---
app.get("/", (req, res) => {
    res.send("🚀 Crackmods API is running...");
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminroutes)

// --- 404 Not Found Middleware ---
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// --- Custom Error Handler ---
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

export default app;