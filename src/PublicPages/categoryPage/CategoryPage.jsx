import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../Components/Cards/card";
import { LayoutGrid, AlertCircle } from "lucide-react";
import './category.scss';

export const CategoryPage = () => {
    const { slug } = useParams(); // ইউআরএল থেকে 'tools' বা 'games' নেবে
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryApps = async () => {
            setLoading(true);
            try {
                // তোমার ব্যাকএন্ডে এই এপিআই এন্ডপয়েন্ট থাকতে হবে
                const res = await fetch(`${import.meta.env.VITE_API_URL}api/apps-by-category/${slug}`);
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
        window.scrollTo(0, 0); // পেজ চেঞ্জ হলে উপরে স্ক্রল করবে
    }, [slug]);

    return (
        <div className="category-wrapper">
            <header className="category-header">
                <div className="container">
                    <h1>
                        <LayoutGrid className="icon" /> 
                        <span>{slug.charAt(0).toUpperCase() + slug.slice(1)}</span> Apps
                    </h1>
                    <p>Explore the best {slug} applications for your Android device.</p>
                </div>
            </header>

            <main className="container">
                {/* --- TOP AD SLOT --- */}
                <div className="category-ad-top">
                    <span className="ad-label">Advertisement</span>
                    <div className="ad-placeholder">
                        {/* Google Ad Code Here */}
                        <p>Horizontal Responsive Ad</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Gathering the best apps for you...</div>
                ) : (
                    <section className="apps-grid">
                        {apps.length > 0 ? (
                            apps.map((app) => (
                                <Card 
                                    key={app._id}
                                    id={app._id}
                                    title={app.name}
                                    iconImg={`${import.meta.env.VITE_API_URL}${app.icon_path}`}
                                    screenshotImg={`${import.meta.env.VITE_API_URL}${app.screenshots[0]}`}
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

                {/* --- BOTTOM AD SLOT --- */}
                <div className="category-ad-bottom">
                    <div className="ad-placeholder">
                        <p>Native Banner Ad</p>
                    </div>
                </div>
            </main>
        </div>
    );
};