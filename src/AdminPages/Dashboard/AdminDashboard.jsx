import { useEffect, useState } from "react";
import './AdminDashboard.scss';
import { Trash2, Edit, X, Mail, User as UserIcon, Shield } from "lucide-react";

export const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null); 
    const [updateLoading, setUpdateLoading] = useState(false);

    // --- সরাসরি হার্ডকোড করা বেস ইউআরএল ---
    const BASE_URL = "https://crackmods.onrender.com/";
    // অ্যাডমিন এপিআই পাথ (শেষে স্ল্যাশ ছাড়া রাখলে সুবিধা)
    const apiBase = `${BASE_URL}api/admin`; 

    // ১. সব ইউজার ডাটা লোড করা
    const fetchAllUsers = async () => {
        try {
            const res = await fetch(`${apiBase}/all`, { credentials: 'include' });
            const data = await res.json();
            
            console.log("Full API Response:", data); // এই লাইনটি দিয়ে চেক করবেন কনসোলে কী আসছে

            if (res.ok) {
                // যদি ডাটা data.allUsers-এ থাকে তবে সেটা নেবে, 
                // নাহলে যদি data.users-এ থাকে সেটা নেবে, 
                // আর তাও না থাকলে সরাসরি data নেবে (যদি ডাটা সরাসরি অ্যারে হয়)
                const usersList = data.allUsers || data.users || data;
                
                // নিশ্চিত করুন usersList একটি Array
                setUsers(Array.isArray(usersList) ? usersList : []);
            }
        } catch (err) { 
            console.error("Fetch Error:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchAllUsers(); }, []);

    // ২. ইউজার ডিলিট করা
    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const res = await fetch(`${apiBase}/delete/${id}`, { 
                    method: 'DELETE',
                    credentials: 'include' 
                });
                if (res.ok) {
                    setUsers(users.filter(user => user._id !== id));
                    alert("User deleted successfully");
                }
            } catch (err) { console.error(err); }
        }
    };

    // ৩. ইউজার আপডেট সাবমিট করা
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const res = await fetch(`${apiBase}/update/${editingUser._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editingUser.name,
                    role: editingUser.role
                }),
                credentials: 'include'
            });
            
            if (res.ok) {
                alert("User updated!");
                setEditingUser(null);
                fetchAllUsers(); // টেবিল রিফ্রেশ
            } else {
                const data = await res.json();
                alert(data.message || "Update failed");
            }
        } catch (err) { 
            console.error(err); 
        } finally { 
            setUpdateLoading(false); 
        }
    };

    return (
        <div className="main-content-inner">
            <div className="header">
                <h2>User Management</h2>
                <span className="user-count">Total Users: {users.length}</span>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-state">Loading users data...</div>
                ) : (
                    <table className="apps-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? users.map((user) => (
                                <tr key={user._id}>
                                    <td className="app-name">
                                        <div className="user-info-cell">
                                            <UserIcon size={16} />
                                            {user.name}
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="actions">
                                        <button className="btn-edit" onClick={() => setEditingUser({...user})}>
                                            <Edit size={18}/>
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDeleteUser(user._id)}>
                                            <Trash2 size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- User Edit Modal --- */}
            {editingUser && (
                <div className="edit-form-overlay">
                    <div className="edit-form-container">
                        <div className="form-header">
                            <h3>Edit User: {editingUser.name}</h3>
                            <button onClick={() => setEditingUser(null)}><X size={20} /></button>
                        </div>
                        
                        <form onSubmit={handleUpdateUser} className="app-form">
                            <div className="input-group">
                                <label><UserIcon size={14}/> Full Name</label>
                                <input 
                                    type="text" 
                                    value={editingUser.name} 
                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} 
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label><Mail size={14}/> Email (Read Only)</label>
                                <input type="email" value={editingUser.email} disabled />
                            </div>

                            <div className="input-group">
                                <label><Shield size={14}/> User Role</label>
                                <select 
                                    value={editingUser.role} 
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setEditingUser(null)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-submit" disabled={updateLoading}>
                                    {updateLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};