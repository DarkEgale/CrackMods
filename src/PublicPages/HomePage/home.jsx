import { useEffect, useState, useMemo } from "react";
import { Search, Loader2 } from "lucide-react"; // লোডিং দেখানোর জন্য
import { Helmet } from "react-helmet-async";
import Card from "../../Components/Cards/card";
import './home.scss';

export const Home = () => {
    const [apps, setApps] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    // --- API URL ম্যানেজমেন্ট ---
    // এটি নিশ্চিত করে যে শেষে একটা স্ল্যাশ থাকবেই, ডাবল স্ল্যাশ হবে না।
    const API_BASE = import.meta.env.VITE_API_URL 
        ? (import.meta.env.VITE_API_URL.endsWith('/') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/`)
        : "http://localhost:5000/";

    const categories = ["All", "Tools", "Social", "Games", "Productivity"];

    // অ্যাপ ডাটা ফেচ করা
    useEffect(() => {
        const fetchApps = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE}api/auth/all-apps`);
                
                // যদি সার্ভার স্লিপিং মোডে থাকে বা এরর দেয়
                if (!response.ok) {
                    throw new Error(`Server Error: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    setApps(data.allApps);
                    setFilteredApps(data.allApps);
                }
            } catch (error) {
                console.error("Fetch Error Details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, [API_BASE]);

    // ফিল্টারিং লজিক (useMemo ব্যবহার করা ভালো পারফরম্যান্সের জন্য)
    useEffect(() => {
        let result = apps;

        if (activeCategory !== "All") {
            result = result.filter(app => 
                app.category?.toLowerCase() === activeCategory.toLowerCase()
            );
        }

        if (searchTerm.trim()) {
            result = result.filter(app => 
                app.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredApps(result);
    }, [searchTerm, activeCategory, apps]);

    return (
        <div className="home-wrapper">
            <Helmet>
                <title>CrackMods - Download Best Premium Mod APKs for Free</title>
                <meta name="description" content="Download 100% working mod apks for games, tools, and social apps for free." />
            </Helmet>

            {/* --- HERO SECTION --- */}
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
                {/* --- CATEGORY NAV --- */}
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

                {/* --- APPS GRID & LOADING --- */}
                {loading ? (
                    <div className="loading-container">
                        <Loader2 className="spinner" size={40} />
                        <p>Waking up server, please wait...</p>
                    </div>
                ) : (
                    <section className="apps-grid">
                        {filteredApps.length > 0 ? (
                            filteredApps.map((app, index) => (
                                <div key={app._id} className="app-card-item">
                                    {/* Ads Logic */}
                                    {index > 0 && index % 6 === 0 && (
                                        <div className="ad-card-wrapper">
                                            <div className="ad-card-inner">
                                                <span className="ad-label">Sponsored</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <Card
                                        id={app._id}
                                        title={app.name}
                                        // এখানে API_BASE এর সাথে সরাসরি পাথ যোগ হবে, মাঝখানে স্ল্যাশ লাগবে না
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