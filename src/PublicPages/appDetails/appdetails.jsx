import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Download, Layers, Smartphone, Info, CheckCircle, ShieldCheck, Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';



import { AdModal } from "../../Components/AdModel/admodel";
import './appdetails.scss'

export const AppDetails = () => {
    const { id } = useParams();
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showAd, setShowAd] = useState(false);

    const BASE_URL = "https://crackmods.onrender.com/";

    useEffect(() => {
        const fetchAppDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}api/auth/app-details/${id}`);
                const data = await res.json();
                if (data.success) {
                    setApp(data.app);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppDetails();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="loading-details">Loading Application Data...</div>;
    if (!app) return <div className="error-details">Application not found!</div>;

    const handleDownloadTrigger = () => {
        setIsDownloading(true); 
        setTimeout(() => {
            setShowAd(true); 
            setIsDownloading(false); 
        }, 1500);
    };

    return (
        <div className="details-wrapper">
            <Helmet>
                <title>{`${app.name} Mod APK v${app.version} Download`}</title>
                <meta name="description" content={app.details?.substring(0, 160)} />
            </Helmet>

            {showAd && (
                <div style={{ position: 'fixed', zIndex: 9999 }}>
                    <AdModal 
                        onClose={() => setShowAd(false)} 
                        downloadLink={`${BASE_URL}${app.app_path}`} 
                    />
                </div>
            )}

            <header className="details-header">
                <div className="container header-flex">
                    <img src={`${BASE_URL}${app.icon_path}`} alt={app.name} className="main-app-icon" />
                    <div className="app-title-area">
                        <h1>{app.name}</h1>
                        <p className="category-text"><Layers size={14} /> {app.category}</p>
                    </div>
                    <button className="download-btn-top" onClick={handleDownloadTrigger} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                        {isDownloading ? " Loading..." : " Download"}
                    </button>
                </div>
            </header>

            <main className="container main-layout">
                <div className="left-content">
                    
                    {/* --- ১. Screenshots (এখন সবার উপরে) --- */}
                    <section className="screenshots-section box">
                        <h2><Smartphone size={18} /> Screenshots & Preview</h2>
                        {app.screenshots?.length > 0 ? (
                            <Swiper 
                                modules={[Navigation, Pagination, Autoplay]} 
                                spaceBetween={15} 
                                slidesPerView={1.8} 
                                navigation 
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 3000 }}
                                breakpoints={{
                                    640: { slidesPerView: 2.5 },
                                    1024: { slidesPerView: 3.5 }
                                }}
                            >
                                {app.screenshots.map((screen, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="screenshot-card">
                                            <img src={`${BASE_URL}${screen}`} alt={`preview-${index}`} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : <p>No preview available.</p>}
                    </section>

                    {/* --- ২. Description (স্ক্রিনশটের নিচে) --- */}
                    <section className="description-section box">
                        <h2><Info size={18} /> About {app.name}</h2>
                        <div className="details-body" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                            {app.details}
                        </div>
                    </section>

                    {/* --- ৩. Mod Features & Install --- */}
                    <div className="extra-grid">
                        <section className="features-box box">
                            <h3><CheckCircle size={18} /> Mod Features</h3>
                            <div className="content-p">{app.features}</div>
                        </section>
                        <section className="install-box box">
                            <h3><ShieldCheck size={18} /> How to Install</h3>
                            <div className="content-p">{app.howToInstall}</div>
                        </section>
                    </div>
                </div>

                {/* --- ৪. Sidebar --- */}
                <aside className="sidebar">
                    <button className="final-download-btn" onClick={handleDownloadTrigger} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="animate-spin" size={24} /> : <Download size={22} />}
                        <div>
                            <span>{isDownloading ? "Processing..." : "Download Now"}</span>
                            <small>Fast & Secure Download</small>
                        </div>
                    </button>

                    <div className="tech-info-card">
                        <h3>App Information</h3>
                        <div className="info-item"><span>Version</span> <strong>{app.version}</strong></div>
                        <div className="info-item"><span>Rating</span> <strong>{app.rating} ★</strong></div>
                        <div className="info-item"><span>Downloads</span> <strong>{app.downloads}</strong></div>
                        <div className="info-item"><span>Android</span> <strong>{app.requirements}</strong></div>
                        <div className="info-item"><span>Updated</span> <strong>{new Date(app.updatedAt).toLocaleDateString()}</strong></div>
                    </div>
                </aside>
            </main>
        </div>
    );
}