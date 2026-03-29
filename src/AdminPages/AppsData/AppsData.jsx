import { useEffect, useState } from "react";
import { Trash2, Edit, ExternalLink, X, Smartphone, Layers, Info, CheckCircle, List, ShieldCheck, DownloadCloud, Loader2 } from "lucide-react";
import './AppsData.scss';

export const AppsData = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [updating, setUpdating] = useState(false);
    
    // SEO Optimized Edit State
    const [editData, setEditData] = useState({
        name: "", version: "", category: "", 
        mainDescription: "", features: "", 
        whyChoose: "", howToInstall: "", requirements: ""
    });
    const [editFiles, setEditFiles] = useState({ icon: null, apkFile: null });

    const api = 'http://localhost:5000/api/admin';

    const fetchApps = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${api}/all-apps`, { credentials: 'include' });
            const data = await response.json();
            if (data.success) setApps(data.allApps);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApps(); }, []);

    const handleEditClick = (app) => {
        setSelectedApp(app);
        setEditData({
            name: app.name || "",
            version: app.version || "",
            category: app.category || "",
            mainDescription: app.mainDescription || "",
            features: app.features || "",
            whyChoose: app.whyChoose || "",
            howToInstall: app.howToInstall || "",
            requirements: app.requirements || ""
        });
        setIsEditOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        const formData = new FormData();
        
        Object.keys(editData).forEach(key => formData.append(key, editData[key]));
        if (editFiles.icon) formData.append("icon", editFiles.icon);
        if (editFiles.apkFile) formData.append("apkFile", editFiles.apkFile);

        try {
            const response = await fetch(`${api}/update-app/${selectedApp._id}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                alert("App Updated Successfully!");
                setIsEditOpen(false);
                fetchApps();
            }
        } catch (error) {
            alert("Update Failed!");
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this app?")) {
            try {
                const res = await fetch(`${api}/delete-app/${id}`, { method: 'DELETE', credentials: 'include' });
                if(res.ok) setApps(apps.filter(app => app._id !== id));
            } catch (err) { console.error(err); }
        }
    };

    return (
        <div className="apps-container">
            <div className="main-content">
                <div className="header">
                    <h2>Manage Applications</h2>
                    <span>Total Apps: {apps.length}</span>
                </div>

                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-msg">Fetching data...</div>
                    ) : (
                        <table className="apps-table">
                            <thead>
                                <tr>
                                    <th>App Name</th>
                                    <th>Version</th>
                                    <th>Category</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.map((app) => (
                                    <tr key={app._id}>
                                        <td className="app-name">{app.name}</td>
                                        <td><span className="version-badge">v{app.version}</span></td>
                                        <td style={{textTransform: 'capitalize'}}>{app.category}</td>
                                        <td className="actions">
                                            <button className="btn-edit" onClick={() => handleEditClick(app)}><Edit size={18} /></button>
                                            <button className="btn-delete" onClick={() => handleDelete(app._id)}><Trash2 size={18} /></button>
                                            <button className="btn-view"><ExternalLink size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* --- EDIT MODAL OVERLAY --- */}
            {isEditOpen && (
                <div className="edit-form-overlay">
                    <div className="edit-form-container">
                        <div className="form-header">
                            <h3>Edit: {editData.name}</h3>
                            <button className="close-btn" onClick={() => setIsEditOpen(false)}><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleUpdateSubmit} className="app-form">
                            <div className="form-row">
                                <div className="input-group">
                                    <label><Smartphone size={14}/> Name</label>
                                    <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label><Layers size={14}/> Version</label>
                                    <input type="text" value={editData.version} onChange={(e) => setEditData({...editData, version: e.target.value})} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label><Info size={14}/> Intro Description</label>
                                <textarea rows="3" value={editData.mainDescription} onChange={(e) => setEditData({...editData, mainDescription: e.target.value})} />
                            </div>

                            <div className="input-group">
                                <label><List size={14}/> Features (One per line)</label>
                                <textarea rows="4" value={editData.features} onChange={(e) => setEditData({...editData, features: e.target.value})} />
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label><ShieldCheck size={14}/> Why Choose Mod?</label>
                                    <textarea rows="2" value={editData.whyChoose} onChange={(e) => setEditData({...editData, whyChoose: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label><DownloadCloud size={14}/> Install Guide</label>
                                    <textarea rows="2" value={editData.howToInstall} onChange={(e) => setEditData({...editData, howToInstall: e.target.value})} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label><CheckCircle size={14}/> Requirements</label>
                                <input type="text" value={editData.requirements} onChange={(e) => setEditData({...editData, requirements: e.target.value})} />
                            </div>

                            <div className="upload-grid">
                                <div className="upload-box">
                                    <label>New Icon (Optional)</label>
                                    <input type="file" onChange={(e) => setEditFiles({...editFiles, icon: e.target.files[0]})} />
                                </div>
                                <div className="upload-box">
                                    <label>New APK (Optional)</label>
                                    <input type="file" onChange={(e) => setEditFiles({...editFiles, apkFile: e.target.files[0]})} />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="btn-cancel">Discard</button>
                                <button type="submit" className="btn-submit" disabled={updating}>
                                    {updating ? <Loader2 className="spinner" size={18} /> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};