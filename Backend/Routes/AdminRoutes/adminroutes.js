import express from "express";
import { upload } from "../../Middleware/multer.js";
import { Protected } from "../../Middleware/authmiddleware.js";
import { GetAllUsers, DeleteUser, UpdateUser } from "../../Controllers/AdminControllers/adminControllers.js";
import { 
    publishApp, 
    getAllApps, 
    getSingleApp, 
    updateApp, 
    deleteApp,
    getAppsByCategory 
} from "../../Controllers/AdminControllers/appControllers.js";

const router = express.Router();

// 🔒 AI LINER NICHER SHOB ROUTE PROTECTED (Sudhu login kora admin-er jonno)
router.use(Protected); 

// --- USER MANAGEMENT ---
router.get('/all', GetAllUsers);
router.delete('/delete/:id', DeleteUser);
router.patch('/update/:id', UpdateUser);

// --- APP MANAGEMENT ---
router.get("/all-apps", getAllApps);
router.get("/app/:id", getSingleApp);
router.get("/apps-by-category/:slug", getAppsByCategory);

// App Publish (Files shoho)
router.post("/publish", upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'screenshots', maxCount: 5 },
    { name: 'apkFile', maxCount: 1 }
]), publishApp);

// App Update (Files shoho)
router.patch("/update-app/:id", upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'screenshots', maxCount: 5 },
    { name: 'apkFile', maxCount: 1 }
]), updateApp);

router.delete("/delete-app/:id", deleteApp);

export default router;

//This tis Admin route