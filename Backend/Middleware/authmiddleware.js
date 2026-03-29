import jwt from 'jsonwebtoken';

export const Protected = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // ১. টোকেন আছে কি না চেক করা
        if (!token) {
            return res.status(401).json({ message: "Unauthorized Access: No Token Provided" });
        }

        // ২. টোকেন ভেরিফাই করা
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ৩. রোল চেক করা (ইউজার কি অ্যাডমিন?)
        // তোমার ডাটাবেস মডেলে যদি role: 'admin' থাকে তবেই সে ঢুকতে পারবে
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admin Access Only" });
        }

        req.user = decoded; // ইউজারের ডাটা রিকোয়েস্টে সেট করা
        next(); // পরের ধাপে পাঠানো

    } catch (error) {
        console.error("Auth Error:", error.message);
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid Token" });
        }
        
        res.status(500).json({ message: "Internal Server Error" });
    }
};