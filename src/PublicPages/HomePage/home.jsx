import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react"; 
import { Helmet } from "react-helmet-async";
import Card from "../../Components/Cards/card";
import { AdModal } from "../../Components/AdModel/admodel"; // আপনার অ্যাড মডাল ইমপোর্ট করুন
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

    const API_BASE = "https://crackmods.onrender.com/";
    const categories = ["All", "Tools", "Social", "Games", "Productivity"];

    useEffect(() => {
        const fetchApps = async () => {
            setLoading(true);
            try {
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

    // ডাউনলোড বাটনে ক্লিক করলে যা হবে
    const handleDownloadClick = (app) => {
        // এখানে আপনার ফাইলের আসল লিঙ্কটি সেট করুন
        const finalLink = `${API_BASE}${app.file_path}`; 
        setSelectedDownloadLink(finalLink);
        setShowAdModal(true); // মডাল ওপেন হবে
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

            {/* যদি মডাল ট্রু হয়, তবেই অ্যাড মডাল দেখাবে */}
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
                                    onClick={() => handleDownloadClick(app)} // কার্ডে ক্লিক করলে মডাল আসবে
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Card
                                        id={app._id}
                                        title={app.name}
                                        iconImg={`${API_BASE}${app.icon_path}`}
                                        screenshotImg={`${API_BASE}${app.screenshots?.[0] || ""}`}
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