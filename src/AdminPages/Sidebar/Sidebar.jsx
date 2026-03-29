import { Users, LayoutGrid, PlusCircle, LogOut, ChevronRight } from "lucide-react";
import './Sidebar.scss';

export const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'users', label: 'Users', icon: <Users size={20} /> },
        { id: 'apps', label: 'All Apps', icon: <LayoutGrid size={20} /> },
        { id: 'publish', label: 'Publish New App', icon: <PlusCircle size={20} /> },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">A</div>
                    <span>AdminPanel</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.id}
                            className={activeTab === item.id ? 'active' : ''}
                            // এখানে একটি চেক বসিয়ে দিলাম যাতে ফাংশন না থাকলে ক্র্যাশ না করে
                            onClick={() => setActiveTab && setActiveTab(item.id)}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                            {activeTab === item.id && <ChevronRight size={16} className="arrow" />}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={() => console.log("Logout Clicked")}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};