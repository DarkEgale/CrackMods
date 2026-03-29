import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react"; 
import { Helmet } from "react-helmet-async";
import Card from "../../Components/Cards/card";
import { AdModal } from "../../Components/AdModel/admodel"; 
import './home.scss';

export const Home = () => {
    const [apps, setApps] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    // মডাল কন্ট্রোল করার জন্য স্টেট
    const [showAdModal, setShowAdModal] = useState(false);
    const [selectedDownloadLink, setSelectedDownloadLink] = useState("");

    // আপনার ব্যাকএন্ড এপিআই বেস ইউআরএল (শুধু এপিআই কলের জন্য লাগবে)
    const API_BASE = "https://crackmods.onrender.com/";
    const categories = ["All", "Tools", "Social", "Games", "Productivity"];

    useEffect(() => {
        const fetchApps = async () => {
            setLoading(true);
            try {
                // এপিআই কল করার সময় API_BASE ব্যবহার হবে
                const response = await fetch(`${API_BASE}api/auth/all-apps`);
                const data = await response.json();
                if (data.success) {
                    setApps(data.allApps);
                    setFilteredApps(data.allApps);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    // ডাউনলোড বাটনে ক্লিক করলে মডাল ওপেন হবে
    const handleDownloadClick = (app) => {
        // যেহেতু app_path এ এখন টেলিগ্রাম ফাইল আইডি আছে, তাই আপাতত সেটিই সেট করছি
        // ভবিষ্যতে ডাউনলোড গেটওয়ে বানালে এখানে পরিবর্তন আসবে
        const finalLink = app.app_path; 
        setSelectedDownloadLink(finalLink);
        setShowAdModal(true); 
    };

    useEffect(() => {
        let result = apps;
        if (activeCategory !== "All") {
            result = result.filter(app => app.category?.toLowerCase() === activeCategory.toLowerCase());
        }
        if (searchTerm.trim()) {
            result = result.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFilteredApps(result);
    }, [searchTerm, activeCategory, apps]);

    return (
        <div className="home-wrapper">
            <Helmet>
                <title>CrackMods - Download Best Premium Mod APKs for Free</title>
                <meta name="description" content="Download 100% working mod apks for games, tools, and social apps for free." />
            </Helmet>

            {/* অ্যাড মডাল */}
            {showAdModal && (
                <AdModal 
                    downloadLink={selectedDownloadLink} 
                    onClose={() => setShowAdModal(false)} 
                />
            )}

            <header className="hero-section">
                <div className="hero-content">
                    <h1>Explore Premium <span>Applications For Free</span></h1>
                    <div className="search-bar">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search apps by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <main className="container">
                <nav className="filter-nav">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={activeCategory === cat ? "active" : ""}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>

                {loading ? (
                    <div className="loading-container">
                        <Loader2 className="spinner" size={40} />
                        <p>Waking up server, please wait...</p>
                    </div>
                ) : (
                    <section className="apps-grid">
                        {filteredApps.length > 0 ? (
                            filteredApps.map((app) => (
                                <div 
                                    key={app._id} 
                                    className="app-card-item" 
                                    onClick={() => handleDownloadClick(app)} 
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* এখানে খেয়াল করুন: iconImg এবং screenshotImg এ কোনো API_BASE যোগ করা হয়নি */}
                                    <Card
                                        id={app._id}
                                        title={app.name}
                                        iconImg={app.icon_path} 
                                        screenshotImg={app.screenshots?.[0] || ""} 
                                        category={app.category}
                                        rating={app.rating || "4.8"}
                                        downloads={app.downloads || "1M+"}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="no-results">No applications found.</div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};