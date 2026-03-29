import express from "express";
import { Register, Login } from "../Controllers/authControllers.js";
import { 
    getAllApps, 
    getAppsByCategory, 
    getSingleApp 
} from "../Controllers/AdminControllers/appControllers.js";
import { Protected } from "../Middleware/authmiddleware.js";

const router = express.Router();

// --- 🔓 Public Routes (লগইন ছাড়াই সবাই এক্সেস করতে পারবে) ---

// ১. রেজিস্ট্রেশন এবং লগইন
router.post('/register', Register);
router.post('/login', Login);

// ২. হোম পেজ (সব অ্যাপের লিস্ট)
router.get('/all-apps', getAllApps);

// ৩. ক্যাটাগরি পেজ (Tools, Games ইত্যাদি ফিল্টার)
router.get('/apps-by-category/:slug', getAppsByCategory);

// ৪. অ্যাপ ডিটেইলস পেজ (আইডি দিয়ে একটি নির্দিষ্ট অ্যাপ দেখা)
router.get('/app-details/:id', getSingleApp); 

// ৫. ডাউনলোড রাউট (সরাসরি ডাউনলোড করার জন্য)
// যদি তুমি ডাউনলোডের সংখ্যা ট্র্যাক করতে চাও, তবে একটি কন্ট্রোলার লাগবে
router.get('/download/:id', (req, res) => {
    // এখানে সরাসরি ফাইল সার্ভ করা বা রিডাইরেক্ট লজিক থাকবে
    // উদাহরণস্বরূপ:
    // const app = await App.findById(req.params.id);
    // res.redirect(`http://localhost:5000/${app.app_path}`);
});


// --- 🔒 Protected Routes (শুধু লগইন করা ইউজারদের জন্য) ---

// ইউজার প্রোফাইল
router.get('/user-profile', Protected, (req, res) => {
    res.json({ success: true, user: req.user });
});

// যদি ভবিষ্যতে ইউজারদের জন্য 'Favorite' বা 'Review' সিস্টেম করো:
// router.post('/add-review', Protected, addReviewController);

export default router;