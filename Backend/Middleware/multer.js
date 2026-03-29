import multer from "multer";
import path from "path";
import fs from "fs";

// ফাইল যেখানে জমা হবে সেই ডিরেক্টরি তৈরি করা (যদি না থাকে)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        
        // ফিল্ড নেম অনুযায়ী আলাদা ফোল্ডার সিলেক্ট করা
        if (file.fieldname === "icon") uploadPath += "icons/";
        else if (file.fieldname === "screenshots") uploadPath += "screenshots/";
        else if (file.fieldname === "apkFile") uploadPath += "apks/";

        // ফোল্ডার না থাকলে তৈরি করে নেবে
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // ইউনিক নাম তৈরি করা: timestamp + original name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// ফাইল ফিল্টার (শুধু নির্দিষ্ট ফরম্যাট অ্যালাউ করা)
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "apkFile") {
        if (file.originalname.endsWith('.apk')) {
            cb(null, true);
        } else {
            cb(new Error("Only APK files are allowed!"), false);
        }
    } else {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed!"), false);
        }
    }
};

export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // সর্বোচ্চ ১০০ এমবি লিমিট
});