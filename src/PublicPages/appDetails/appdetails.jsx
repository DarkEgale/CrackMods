import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Download, Star, Cpu, Layers, Info, CheckCircle, Smartphone, ShieldCheck, Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { AdModal } from "../../Components/AdModel/admodel";
import './appdetails.scss';

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

    // ডাউনলোড লজিক
    const handleDownloadTrigger = () => {
        setIsDownloading(true); 
        
        // বাটন অ্যানিমেশন দেখানোর ১.৫ সেকেন্ড পর অ্যাড শো করবে
        setTimeout(() => {
            setShowAd(true); // এটি AdModal ওপেন করবে
            setIsDownloading(false); 
        }, 1500);
    };

    return (
        <div className="details-wrapper">
            <Helmet>
                <title>{`${app.name} Mod APK v${app.version} Download`}</title>
            </Helmet>

            {/* --- অ্যাড পপ-আপ (এটি সবার উপরে রাখুন) --- */}
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
                    <button 
                        className="download-btn-top" 
                        onClick={handleDownloadTrigger} 
                        disabled={isDownloading}
                    >
                        {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                        {isDownloading ? " Loading..." : " Download"}
                    </button>
                </div>
            </header>

            <main className="container main-layout">
                <div className="left-content">
                    {/* Screenshots */}
                    <section className="screenshots-section">
                        <h2><Smartphone size={18} /> Screenshots</h2>
                        {app.screenshots?.length > 0 && (
                            <Swiper modules={[Navigation, Pagination, Autoplay]} spaceBetween={15} slidesPerView={1.5} navigation>
                                {app.screenshots.map((screen, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={`${BASE_URL}${screen}`} alt="screenshot" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </section>
                </div>

                <aside className="sidebar">
                    {/* বড় ডাউনলোড বাটন */}
                    <button 
                        className={`final-download-btn ${isDownloading ? 'loading' : ''}`} 
                        onClick={handleDownloadTrigger} 
                        disabled={isDownloading}
                    >
                        {isDownloading ? <Loader2 className="animate-spin" size={24} /> : <Download size={22} />}
                        <div>
                            <span>{isDownloading ? "Downloading..." : "Download Now"}</span>
                            <small>{isDownloading ? "Preparing your link" : "Safe & Fast"}</small>
                        </div>
                    </button>
                </aside>
            </main>
        </div>
    );
};