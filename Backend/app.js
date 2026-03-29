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


const allowedOrigins = [
  'https://www.mdshimulhossen.top', 
  'https://mdshimulhossen.top', 
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    // যদি রিকোয়েস্টটি কোনো ব্রাউজার থেকে না আসে (যেমন CronJob বা Postman), তবে origin হবে undefined
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // লগইন বা ক্রেডেনশিয়াল সাপোর্টের জন্য
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
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