import { useState } from "react";
import { Upload, Smartphone, Info, Layers, Image as ImageIcon, FileCode, Loader2, List, HelpCircle, DownloadCloud } from "lucide-react";
import './PublishApp.scss';

export const AppUploadForm = () => {
    // ১. স্টেট আপডেট: details এর বদলে আলাদা আলাদা ফিল্ড
    const [formData, setFormData] = useState({
        name: "",
        version: "",
        category: "",
        mainDescription: "", // অ্যাপের ভূমিকা
        features: "",        // অ্যাপের ফিচারসমূহ
        whyChoose: "",       // কেন ইউজ করবে
        howToInstall: "",    // ইন্সটলেশন গাইড
        requirements: ""
    });

    const [files, setFiles] = useState({
        icon: null,
        screenshots: [],
        apkFile: null
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (name === "screenshots") {
            setFiles(prev => ({ ...prev, screenshots: selectedFiles }));
        } else {
            setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        // সব টেক্সট ডাটা অ্যাপেন্ড করা
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        
        if (files.icon) data.append("icon", files.icon);
        if (files.apkFile) data.append("apkFile", files.apkFile);
        if (files.screenshots.length > 0) {
            Array.from(files.screenshots).forEach(file => {
                data.append("screenshots", file);
            });
        }

        try {
            const api = `${import.meta.env.VITE_API_URL}api/admin/publish-app`;
            const res = await fetch(api, { method: "POST", body: data });
            if (res.ok) {
                alert("App Published Successfully!");
                window.location.reload(); // ফর্ম রিসেট
            } else {
                alert("Failed to publish app");
            }
        } catch (err) {
            alert("Network Error!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <div className="form-container">
                <div className="form-header">
                    <h2>Publish New App (SEO Optimized)</h2>
                    <p>Each section will be automatically formatted for search engines.</p>
                </div>

                <form className="app-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-group">
                            <label><Smartphone size={16} /> App Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label><Layers size={16} /> Version</label>
                            <input type="text" name="version" value={formData.version} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-group">
                        <label><List size={16} /> Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="tools">Tools</option>
                            <option value="games">Games</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="prices">Premium/VPNs</option>
                        </select>
                    </div>

                    {/* --- SEO SECTIONS --- */}
                    <div className="input-group">
                        <label><Info size={16} /> Short Description (Intro)</label>
                        <textarea name="mainDescription" value={formData.mainDescription} onChange={handleChange} rows="3" placeholder="What is this app about?"></textarea>
                    </div>

                    <div className="input-group">
                        <label><List size={16} /> Main Features</label>
                        <textarea name="features" value={formData.features} onChange={handleChange} rows="4" placeholder="Enter features (one per line)"></textarea>
                    </div>

                    <div className="input-group">
                        <label><HelpCircle size={16} /> Why Choose This Mod?</label>
                        <textarea name="whyChoose" value={formData.whyChoose} onChange={handleChange} rows="3" placeholder="What makes this version special?"></textarea>
                    </div>

                    <div className="input-group">
                        <label><DownloadCloud size={16} /> How to Install Guide</label>
                        <textarea name="howToInstall" value={formData.howToInstall} onChange={handleChange} rows="3" placeholder="Step 1, Step 2, etc..."></textarea>
                    </div>

                    <div className="input-group">
                        <label><FileCode size={16} /> Requirements</label>
                        <input type="text" name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Android 8.0+, 4GB RAM" />
                    </div>

                    {/* --- FILES SECTION (Same as before) --- */}
                    <div className="upload-grid">
                        <div className="upload-box">
                            <label>App Icon</label>
                            <div className="file-input">
                                <input type="file" name="icon" accept="image/*" id="icon" onChange={handleFileChange} required />
                                <label htmlFor="icon" className={files.icon ? 'selected' : ''}>
                                    <ImageIcon size={20} /> {files.icon ? files.icon.name : "Choose Icon"}
                                </label>
                            </div>
                        </div>

                        <div className="upload-box">
                            <label>Screenshots ({files.screenshots.length})</label>
                            <div className="file-input">
                                <input type="file" name="screenshots" accept="image/*" multiple id="screenshots" onChange={handleFileChange} />
                                <label htmlFor="screenshots" className={files.screenshots.length > 0 ? 'selected' : ''}>
                                    <ImageIcon size={20} /> {files.screenshots.length > 0 ? `${files.screenshots.length} Files Selected` : "Upload Images"}
                                </label>
                            </div>
                        </div>

                        <div className="upload-box full-width">
                            <label>APK File</label>
                            <div className="file-input binary">
                                <input type="file" name="apkFile" accept=".apk" id="apk" onChange={handleFileChange} required />
                                <label htmlFor="apk" className={files.apkFile ? 'selected' : ''}>
                                    <Upload size={20} /> {files.apkFile ? files.apkFile.name : "Select APK File"}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" disabled={loading}>Discard</button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? <><Loader2 size={18} className="spinner" /> Publishing...</> : "Publish App"}
                        </button>
                    </div>
                </form>
            </div>
        </div>

                    
    );
};

           