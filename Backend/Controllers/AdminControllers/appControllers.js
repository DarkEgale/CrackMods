import Apps from "../../Models/AppsModels.js";
import { cloudinary } from "../../Middleware/multer.js";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios"; // axios ইমপোর্ট করা হয়েছে
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// --- হেল্পার ফাংশন: ক্লাউডিনারিতে ইমেজ আপলোড ---
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "crackmods_assets",
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

// ১. নতুন অ্যাপ পাবলিশ করা
export const publishApp = async (req, res) => {
    try {
        const { name, version, category, mainDescription, features, whyChoose, howToInstall, requirements } = req.body;

        if (!req.files || !req.files['icon'] || !req.files['apkFile']) {
            return res.status(400).json({ success: false, message: "Please upload both App Icon and APK File" });
        }

        const icon_path = await uploadToCloudinary(req.files['icon'][0].buffer);

        let screenshots = [];
        if (req.files['screenshots']) {
            for (const file of req.files['screenshots']) {
                const url = await uploadToCloudinary(file.buffer);
                screenshots.push(url);
            }
        }

        const apkFile = req.files['apkFile'][0];
        const telegramRes = await bot.sendDocument(
            CHAT_ID, 
            apkFile.buffer, 
            {
                caption: `📦 *App:* ${name}\n🚀 *Version:* ${version}`,
                parse_mode: 'Markdown'
            }, 
            { 
                filename: apkFile.originalname,
                contentType: 'application/vnd.android.package-archive' 
            }
        );

        const app_path = telegramRes.document.file_id;

        const newApp = await Apps.create({
            name, version, category, mainDescription, features, whyChoose, howToInstall, requirements,
            icon_path, app_path, screenshots
        });

        res.status(201).json({ success: true, message: "Application published successfully!", data: newApp });

    } catch (error) {
        console.error("Publish Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ২. সব অ্যাপ লোড করা
export const getAllApps = async (req, res) => {
    try {
        const apps = await Apps.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, allApps: apps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৩. একটি নির্দিষ্ট অ্যাপ লোড করা
export const getSingleApp = async (req, res) => {
    try {
        const app = await Apps.findById(req.params.id);
        if (!app) return res.status(404).json({ success: false, message: "App not found" });
        res.status(200).json({ success: true, app });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৪. অ্যাপ আপডেট করা
export const updateApp = async (req, res) => {
    try {
        const { id } = req.params;
        const existingApp = await Apps.findById(id);
        if (!existingApp) return res.status(404).json({ success: false, message: "App not found" });

        const dataToUpdate = { ...req.body };

        if (req.files?.['icon']) {
            dataToUpdate.icon_path = await uploadToCloudinary(req.files['icon'][0].buffer);
        }

        if (req.files?.['apkFile']) {
            const apkFile = req.files['apkFile'][0];
            const telegramRes = await bot.sendDocument(
                CHAT_ID, 
                apkFile.buffer, 
                {
                    caption: `🆙 *Update:* ${req.body.name || existingApp.name}`,
                    parse_mode: 'Markdown'
                }, 
                { 
                    filename: apkFile.originalname, 
                    contentType: 'application/vnd.android.package-archive' 
                }
            );
            dataToUpdate.app_path = telegramRes.document.file_id;
        }

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

// ৫. অ্যাপ ডিলিট করা
export const deleteApp = async (req, res) => {
    try {
        await Apps.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "App deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৬. ক্যাটাগরি অনুযায়ী অ্যাপ
export const getAppsByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const apps = await Apps.find({ category: { $regex: new RegExp(`^${slug}$`, "i") } });
        res.status(200).json({ success: true, apps: apps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- ৭. টেলিগ্রাম থেকে ফাইল ডাউনলোড (Streaming Method) ---
export const downloadApp = async (req, res) => {
    try {
        const { fileId } = req.params;
        console.log("Download Request for ID:", fileId);

        // ১. টেলিগ্রাম থেকে ফাইল পাথ বের করা
        const fileInfoUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getFile?file_id=${fileId}`;
        const infoRes = await axios.get(fileInfoUrl);
        
        if (!infoRes.data.ok) return res.status(404).send("File not found on Telegram");

        const filePath = infoRes.data.result.file_path;
        const downloadUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${filePath}`;

        // ২. সরাসরি টেলিগ্রাম থেকে ডাটা স্ট্রিম করে ইউজারের ব্রাউজারে পাঠানো
        // এতে মেমোরি খরচ হবে না, Bad Gateway আসবে না
        const response = await axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'stream'
        });

        // ৩. হেডার সেট করা
        res.setHeader('Content-Disposition', 'attachment; filename="crackmods_app.apk"');
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');

        // সরাসরি পাইপ করে পাঠানো
        response.data.pipe(res);

    } catch (error) {
        console.error("Streaming Error:", error.message);
        if (!res.headersSent) {
            res.status(502).json({ success: false, message: "Telegram streaming failed" });
        }
    }
};