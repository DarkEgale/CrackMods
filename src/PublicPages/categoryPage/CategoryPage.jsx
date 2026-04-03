import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../Components/Cards/card";
import { LayoutGrid, AlertCircle, Loader2 } from "lucide-react";
import './category.scss';

export const CategoryPage = () => {
    const { slug } = useParams(); 
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- সরাসরি হার্ডকোড করা লিঙ্ক ---
    const BASE_URL = "https://crackmods.onrender.com/";

    useEffect(() => {
        const fetchCategoryApps = async () => {
            setLoading(true);
            try {
                // আপনার ব্যাকএন্ড এন্ডপয়েন্ট অনুযায়ী লিঙ্কটি হবে (auth থাকলে মাঝখানে যোগ করুন)
                // আমি এখানে api/auth/apps-by-category/${slug} দিচ্ছি আপনার আগের রাউট প্যাটার্ন দেখে
                const res = await fetch(`${BASE_URL}api/auth/apps-by-category/${slug}`);
                const data = await res.json();
                
                if (data.success) {
                    setApps(data.apps);
                }
            } catch (error) {
                console.error("Error fetching category apps:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryApps();
        window.scrollTo(0, 0); 
    }, [slug]);

    return (
        <div className="category-wrapper">
            <header className="category-header">
                <div className="container">
                    <h1>
                        <LayoutGrid className="icon" /> 
                        <span>{slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Category"}</span> Apps
                    </h1>
                    <p>Explore the best {slug} applications for your Android device.</p>
                </div>
            </header>

            <main className="container">
                <div className="category-ad-top">
                    <span className="ad-label">Advertisement</span>
                    <div className="ad-placeholder">
                        <p>Horizontal Responsive Ad</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <Loader2 className="spinner animate-spin" size={32} />
                        <p>Gathering the best apps for you...</p>
                    </div>
                ) : (
                    <section className="apps-grid">
                        {apps.length > 0 ? (
                            apps.map((app) => (
                                <Card 
                                    key={app._id}
                                    id={app._id}
                                    title={app.name}
                                    // ইমেজ পাথ হার্ডকোড ফিক্স
                                    iconImg={`${app.icon_path}`}
                                    screenshotImg={app.screenshots?.[0] ? `${app.screenshots[0]}` : ""}
                                    category={app.category}
                                    rating={app.rating || "4.5"}
                                    downloads={app.downloads || "500K+"}
                                />
                            ))
                        ) : (
                            <div className="no-apps">
                                <AlertCircle size={40} />
                                <p>No apps found in this category yet.</p>
                            </div>
                        )}
                    </section>
                )}

                <div className="category-ad-bottom">
                    <div className="ad-placeholder">
                        <p>Native Banner Ad</p>
                    </div>
                </div>
            </main>
        </div>
    );
};