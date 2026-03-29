import { useState } from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { AdminDashboard } from "./Dashboard/AdminDashboard";
import { AppsData } from "./AppsData/AppsData";
import { AppUploadForm } from "./PublishApp/PublishApp";

export const AdminPanel = () => {
    // ডিফল্টভাবে 'users' ট্যাব ওপেন থাকবে
    const [activeTab, setActiveTab] = useState('users');

    // লজিক: ট্যাব অনুযায়ী কোন কম্পোনেন্ট দেখাবে তা ঠিক করা
    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <AdminDashboard />;
            case 'apps':
                return <AppsData />;
            case 'publish':
                return <AppUploadForm />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="admin-layout" style={{ display: 'flex' }}>
            {/* সাইডবারে স্টেট এবং ফাংশন পাস করা হচ্ছে */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* ডানপাশের কন্টেন্ট এরিয়া */}
            <main className="content-area" style={{ 
                flex: 1, 
                marginLeft: '260px', 
                minHeight: '100vh',
                padding: '20px'
            }}>
                {renderContent()}
            </main>
        </div>
    );
};