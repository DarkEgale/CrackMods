import Apps from "../../Models/AppsModels.js";
import fs from "fs";
import path from "path";

// ১. নতুন অ্যাপ পাবলিশ করা (Create)
export const publishApp = async (req, res) => {
    try {
        // নতুন SEO ফিল্ডগুলো destructure করা হয়েছে
        const { 
            name, 
            version, 
            category, 
            mainDescription, 
            features, 
            whyChoose, 
            howToInstall, 
            requirements 
        } = req.body;

        // ফাইল চেক (আইকন এবং এপিকে থাকা বাধ্যতামূলক)
        if (!req.files || !req.files['icon'] || !req.files['apkFile']) {
            return res.status(400).json({ 
                success: false, 
                message: "Please upload both App Icon and APK File" 
            });
        }

        const icon_path = req.files['icon'][0].path;
        const app_path = req.files['apkFile'][0].path;
        
        const screenshots = req.files['screenshots'] 
            ? req.files['screenshots'].map(file => file.path) 
            : [];

        // ডাটাবেসে নতুন অ্যাপ তৈরি (নতুন ফিল্ড সহ)
        const newApp = await Apps.create({
            name,
            version,
            category,
            mainDescription,
            features,
            whyChoose,
            howToInstall,
            requirements,
            icon_path,
            app_path,
            screenshots
        });

        res.status(201).json({ 
            success: true, 
            message: "Application published successfully!", 
            data: newApp 
        });

    } catch (error) {
        // এরর হলে আপলোড হওয়া ফাইলগুলো সার্ভার থেকে মুছে ফেলা
        if (req.files) {
            const uploadedFiles = [
                ...(req.files['icon'] || []),
                ...(req.files['apkFile'] || []),
                ...(req.files['screenshots'] || [])
            ];
            uploadedFiles.forEach(file => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }
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

        const { 
            name, 
            version, 
            category, 
            mainDescription, 
            features, 
            whyChoose, 
            howToInstall, 
            requirements 
        } = req.body;

        // নতুন ফাইল আসলে আপডেট হবে, নাহলে আগেরগুলোই থাকবে
        const icon_path = req.files?.['icon'] ? req.files['icon'][0].path : existingApp.icon_path;
        const app_path = req.files?.['apkFile'] ? req.files['apkFile'][0].path : existingApp.app_path;
        const screenshots = req.files?.['screenshots'] 
            ? req.files['screenshots'].map(file => file.path) 
            : existingApp.screenshots;

        const updatedApp = await Apps.findByIdAndUpdate(
            id,
            { 
                name, version, category, 
                mainDescription, features, whyChoose, howToInstall, 
                requirements, icon_path, app_path, screenshots 
            },
            { new: true, runValidators: true }
        );

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

        // সার্ভার থেকে ফাইলগুলো চিরতরে ডিলিট করা
        const filesToDelete = [app.icon_path, app.app_path, ...app.screenshots];
        filesToDelete.forEach(filePath => {
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        await Apps.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "App and associated files deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ৬. ক্যাটাগরি অনুযায়ী অ্যাপ খুঁজে বের করা (Category Search)
export const getAppsByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        // Case-insensitive exact match: SEO এর জন্য এটি সেরা
        const apps = await Apps.find({ 
            category: { $regex: new RegExp(`^${slug}$`, "i") } 
        });

        res.status(200).json({
            success: true,
            apps: apps
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};