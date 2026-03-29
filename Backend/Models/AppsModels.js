import mongoose from "mongoose";

const AppsModels = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "App name Required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "App Category Required"],
        lowercase: true // ক্যাটাগরি সবসময় ছোট হাতের অক্ষরে সেভ হবে (SEO/Search এর জন্য ভালো)
    },
    version: {
        type: String,
        required: [true, "App Version is Required"]
    },
    
    // --- SEO FRIENDLY DESCRIPTION FIELDS ---
    mainDescription: {
        type: String, // অ্যাপের ভূমিকা (Intro)
        required: [true, "Main description is required"]
    },
    features: {
        type: String, // অ্যাপের ফিচারসমূহ (প্রতি লাইন আলাদা করে আসবে)
    },
    whyChoose: {
        type: String, // কেন এই সাইট থেকে ডাউনলোড করবে
    },
    howToInstall: {
        type: String, // ইন্সটলেশন গাইড
    },
    // ---------------------------------------

    requirements: {
        type: String // e.g. Android 8.0+, 4GB RAM
    },
    app_path: {
        type: String, // APK ফাইলের পাথ
        required: [true, "APK Path Required"]
    },
    icon_path: {
        type: String // আইকন ইমেজের পাথ
    },
    screenshots: [
        { type: String } // একাধিক স্ক্রিনশট পাথের অ্যারে
    ],
    rating: {
        type: String,
        default: "4.8"
    },
    downloads: {
        type: String,
        default: "500K+"
    }
}, { timestamps: true });

// সার্চ পারফরম্যান্সের জন্য ইনডেক্সিং
// 'text' ইনডেক্স যোগ করলাম যাতে ভবিষ্যতে সার্চ বার বানালে খুব দ্রুত রেজাল্ট পাও
AppsModels.index({ name: 'text', category: 'text' });

const Apps = mongoose.model("Apps", AppsModels);

export default Apps;