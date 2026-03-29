import Apps from "../../Models/AppsModels.js";
import { cloudinary } from "../../Middleware/multer.js";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// --- হেল্পার ফাংশন: ক্লাউডিনারিতে ইমেজ আপলোড (Buffer থেকে) ---
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "crackmods_assets", // ইমেজগুলো এই ফোল্ডারে জমা হবে
                resource_type: "auto"
            },
            (error, result) => {
                if (result) resolve(result.secure_url);
                else reject(error);
            }
        );
        stream.end(fileBuffer);
    });
};

// ১. নতুন অ্যাপ পাবলিশ করা (Create)
export const publishApp = async (req, res) => {
    try {
        const { name, version, category, mainDescription, features, whyChoose, howToInstall, requirements } = req.body;

        if (!req.files || !req.files['icon'] || !req.files['apkFile']) {
            return res.status(400).json({ success: false, message: "Please upload both App Icon and APK File" });
        }

        // আইকন আপলোড (Cloudinary)
        const icon_path = await uploadToCloudinary(req.files['icon'][0].buffer);

        // স্ক্রিনশট আপলোড (Cloudinary)
        let screenshots = [];
        if (req.files['screenshots']) {
            for (const file of req.files['screenshots']) {
                const url = await uploadToCloudinary(file.buffer);
                screenshots.push(url);
            }
        }

        // APK ফাইল আপলোড (Telegram)
        const apkFile = req.files['apkFile'][0];
        const telegramRes = await bot.sendDocument(CHAT_ID, apkFile.buffer, {
            caption: `📦 App: ${name}\n🚀 Version: ${version}`,
        }, { filename: apkFile.originalname });

        const app_path = telegramRes.document.file_id; // এখানে টেলিগ্রামের File ID সেভ হবে

        const newApp = await Apps.create({
            name, version, category, mainDescription, features, whyChoose, howToInstall, requirements,
            icon_path, app_path, screenshots
        });

        res.status(201).json({ success: true, message: "Application published successfully!", data: newApp });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ২. সব অ্যাপ লোড করা (Read All)
export const getAllApps = async (req, res) => {
    try {
        const apps = await Apps.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, allApps: apps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৩. একটি নির্দিষ্ট অ্যাপ লোড করা (Read Single)
export const getSingleApp = async (req, res) => {
    try {
        const app = await Apps.findById(req.params.id);
        if (!app) return res.status(404).json({ success: false, message: "App not found" });
        res.status(200).json({ success: true, app });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৪. অ্যাপ আপডেট করা (Update)
export const updateApp = async (req, res) => {
    try {
        const { id } = req.params;
        const existingApp = await Apps.findById(id);
        if (!existingApp) return res.status(404).json({ success: false, message: "App not found" });

        const dataToUpdate = { ...req.body };

        // নতুন আইকন আসলে
        if (req.files?.['icon']) {
            dataToUpdate.icon_path = await uploadToCloudinary(req.files['icon'][0].buffer);
        }

        // নতুন APK আসলে
        if (req.files?.['apkFile']) {
            const apkFile = req.files['apkFile'][0];
            const telegramRes = await bot.sendDocument(CHAT_ID, apkFile.buffer, {
                caption: `🆙 Update: ${req.body.name || existingApp.name}`,
            }, { filename: apkFile.originalname });
            dataToUpdate.app_path = telegramRes.document.file_id;
        }

        // নতুন স্ক্রিনশট আসলে
        if (req.files?.['screenshots']) {
            let newScreenshots = [];
            for (const file of req.files['screenshots']) {
                const url = await uploadToCloudinary(file.buffer);
                newScreenshots.push(url);
            }
            dataToUpdate.screenshots = newScreenshots;
        }

        const updatedApp = await Apps.findByIdAndUpdate(id, dataToUpdate, { new: true });

        res.status(200).json({ success: true, message: "App updated successfully", data: updatedApp });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৫. অ্যাপ ডিলিট করা (Delete)
export const deleteApp = async (req, res) => {
    try {
        const app = await Apps.findById(req.params.id);
        if (!app) return res.status(404).json({ success: false, message: "App not found" });

        // নোট: ক্লাউডিনারি বা টেলিগ্রাম থেকে ফাইল ডিলিট করার কোড এখানে দেওয়া হয়নি, 
        // কারণ এতে অনেক সময় API লিমিট শেষ হয়ে যায়। ডাটাবেস থেকে ডিলিট করাই আপাতত যথেষ্ট।
        await Apps.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "App deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৬. ক্যাটাগরি অনুযায়ী অ্যাপ খুঁজে বের করা
export const getAppsByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const apps = await Apps.find({ category: { $regex: new RegExp(`^${slug}$`, "i") } });
        res.status(200).json({ success: true, apps: apps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};