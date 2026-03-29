import express from "express";
import { Register, Login } from "../Controllers/authControllers.js";
import { 
    getAllApps, 
    getAppsByCategory, 
    getSingleApp 
} from "../Controllers/AdminControllers/appControllers.js";
import { Protected } from "../Middleware/authmiddleware.js";
// আপনার App Model টি ইমপোর্ট করুন (পাথ ঠিক করে নিন)
import Apps from "../Models/AppsModels.js"; 

const router = express.Router();

// --- 🌐 SEO & Sitemap Route ---
// এটি সবার উপরে বা পাবলিক রাউটের ভেতরে রাখতে পারেন
router.get('/sitemap.xml', async (req, res) => {
    try {
        const apps = await Apps.find({}, '_id updatedAt');

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://www.mdshimulhossen.top/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

        apps.forEach(app => {
            const date = app.updatedAt ? new Date(app.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            xml += `
    <url>
        <loc>https://www.mdshimulhossen.top/app/${app._id}</loc>
        <lastmod>${date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
        });

        xml += `\n</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);
    } catch (error) {
        console.error("Sitemap Error:", error);
        res.status(500).send("Error generating sitemap");
    }
});

// --- 🔓 Public Routes ---

router.post('/register', Register);
router.post('/login', Login);
router.get('/all-apps', getAllApps);
router.get('/apps-by-category/:slug', getAppsByCategory);
router.get('/app-details/:id', getSingleApp); 

router.get('/download/:id', (req, res) => {
    // ডাউনলোড লজিক...
});

// --- 🔒 Protected Routes ---

router.get('/user-profile', Protected, (req, res) => {
    res.json({ success: true, user: req.user });
});

export default router;