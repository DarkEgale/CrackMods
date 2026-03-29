import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Helmet } from "react-helmet-async"; // SEO এর জন্য হেলমেট যোগ করলাম
import Card from "../../Components/Cards/card";
import './home.scss';

export const Home = () => {
    const [apps, setApps] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    // এখানে ক্যাটাগরিগুলো সব ছোট হাতের (lowercase) রাখো অথবা ফিল্টারের সময় lowercase করে নাও
    const categories = ["All", "Tools", "Social", "Games", "Productivity"];

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/all-apps');
                const data = await res.json();
                if (data.success) {
                    setApps(data.allApps);
                    setFilteredApps(data.allApps);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
            }
        };
        fetchApps();
    }, []);

    useEffect(() => {
        let result = apps;

        // --- ক্যাটাগরি ফিল্টার ফিক্স ---
        if (activeCategory !== "All") {
            result = result.filter(app => 
                // অ্যাপের ক্যাটাগরি এবং সিলেক্টেড ক্যাটাগরি দুইটাই ছোট হাতের করে চেক করা হচ্ছে
                app.category?.toLowerCase() === activeCategory.toLowerCase()
            );
        }

        // --- সার্চ ফিল্টার ---
        if (searchTerm) {
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

            <header className="hero-section">
                <div className="hero-content">
                    <h1>Explore Premium <span>Applications For Free</span> </h1>
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
                {/* ক্যাটাগরি ফিল্টার ন্যাভ */}
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

                <section className="apps-grid">
                    {filteredApps.length > 0 ? (
                        filteredApps.map((app, index) => (
                            <div key={app._id} className="app-card-item">
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
                                    iconImg={`http://localhost:5000/${app.icon_path}`}
                                    screenshotImg={`http://localhost:5000/${app.screenshots[0]}`}
                                    category={app.category}
                                    rating={app.rating || "4.8"}
                                    downloads={app.downloads || "1M+"}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="no-results">No applications found in this category.</div>
                    )}
                </section>
            </main>
        </div>
    );
};