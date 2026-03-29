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
        lowercase: true 
    },
    version: {
        type: String,
        required: [true, "App Version is Required"]
    },
    
    // --- SEO FRIENDLY DESCRIPTION FIELDS ---
    mainDescription: {
        type: String, 
        required: [true, "Main description is required"]
    },
    features: {
        type: String, 
    },
    whyChoose: {
        type: String, 
    },
    howToInstall: {
        type: String, 
    },
    // ---------------------------------------

    requirements: {
        type: String 
    },
    app_path: {
        type: String, 
        required: [true, "APK Path Required"]
    },
    icon_path: {
        type: String 
    },
    screenshots: [
        { type: String } 
    ],
    rating: {
        type: String,
        default: "4.8"
    },
    downloads: {
        type: String,
        default: "500K+"
    }
}, { 
    timestamps: true,
    autoIndex: false // ভবিষ্যতে ইনডেক্স জনিত সমস্যা এড়াতে এটি ব্যবহার করা যায়
});

// সার্চ পারফরম্যান্সের জন্য ইনডেক্সিং
AppsModels.index({ name: 'text', category: 'text' });

const Apps = mongoose.model("Apps", AppsModels);

/**
 * 🛠️ ফিক্স: Duplicate Key Error (packageName_1)
 * এই ফাংশনটি ডাটাবেস থেকে ওই পুরনো এবং জেদি ইনডেক্সটি ডিলিট করে দেবে।
 * একবার সফলভাবে অ্যাপ পাবলিশ হয়ে গেলে নিচের এই অংশটুকু আপনি মুছে ফেলতে পারেন।
 */
Apps.collection.dropIndex('packageName_1')
    .then(() => {
        console.log("✅ Success: packageName Index has been deleted from Database!");
    })
    .catch((err) => {
        // যদি ইনডেক্সটি আগে থেকেই ডিলিট করা থাকে বা না পাওয়া যায়
        console.log("ℹ️ packageName Index not found or already deleted. You are good to go!");
    });

export default Apps;