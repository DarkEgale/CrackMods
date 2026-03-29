import User from "../Models/UserModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exitsUser = await User.findOne({ email });
        if (exitsUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashPassword
        });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        });

        // --- কুকি অপশন ফিক্সড ---
        const cookieOptions = {
            expires: new Date(
                Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            // প্রোডাকশন বা রেন্ডারে থাকলে অবশ্যই true হতে হবে
            secure: true, 
            // ক্রস-সাইট কুকি এলাউ করার জন্য এটি 'none' হতে হবে
            sameSite: 'none' 
        };

        res.status(201)
            .cookie('token', token, cookieOptions)
            .json({ message: "User Registration Successful", user, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Wrong email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // return দিতে ভুলবেন না নাহলে নিচের কোডও এক্সিকিউট হয়ে যাবে
            return res.status(400).json({ message: "Wrong email or password" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        });

        // --- কুকি অপশন ফিক্সড ---
        const cookieOptions = {
            expires: new Date(
                Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: true, 
            sameSite: 'none' 
        };

        const { password: userPassword, ...reset } = user._doc;

        res.status(200)
            .cookie('token', token, cookieOptions)
            .json({ message: "Log in Successful", user: reset, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};