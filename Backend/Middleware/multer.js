import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// ১. ক্লাউডিনারি কনফিগারেশন (সরাসরি এখানেই)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ২. ইমেজের জন্য ক্লাউডিনারি স্টোরেজ (Icon & Screenshots)
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'crackmods_assets',
        upload_preset: 'ColudinaryImages', // আপনার ড্যাশবোর্ডের প্রিসেট নাম
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

// ৩. APK ফাইলের জন্য মেমোরি স্টোরেজ (এটি সার্ভারে ফাইল জমা করবে না, সরাসরি র‍্যামে রাখবে)
// এতে আপনার রেন্ডার সার্ভার ফুল হবে না।
const memoryStorage = multer.memoryStorage();

// ৪. ফাইল ফিল্টার লজিক
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "apkFile") {
        file.originalname.endsWith('.apk') ? cb(null, true) : cb(new Error("Only APK allowed!"), false);
    } else {
        file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only images allowed!"), false);
    }
};

// ৫. এক্সপোর্ট করা (রাউট ফাইলে ব্যবহারের জন্য)
// আমরা এখানে দুই ধরণের স্টোরেজকে হ্যান্ডেল করার জন্য 'memoryStorage' কেই মেইন রাখি,
// কারণ এক সাথে দুইটা স্টোরেজ ইঞ্জিন কাজ করে না। 
// ইমেজগুলো আমরা পরে কন্ট্রোলার থেকে ক্লাউডিনারিতে পুশ করবো।
export const upload = multer({ 
    storage: memoryStorage, 
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

export { cloudinary };