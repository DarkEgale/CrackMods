import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Download, Star, Cpu, Layers, Info, CheckCircle, Smartphone, ShieldCheck, HelpCircle } from "lucide-react";
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
    const [showAd, setShowAd] = useState(false);

    useEffect(() => {
        const fetchAppDetails = async () => {
            try {
                // তোমার ব্যাকএন্ড এপিআই এন্ডপয়েন্ট
                const res = await fetch(`http://localhost:5000/api/auth/app-details/${id}`);
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

    const handleFinalDownload = () => setShowAd(true);

    return (
        <div className="details-wrapper">
            <Helmet>
                <title>{`${app.name} Mod APK v${app.version} Download (Official)`}</title>
                <meta name="description" content={app.mainDescription?.substring(0, 150)} />
                <meta name="keywords" content={`${app.name} mod apk, download ${app.name}, cracked ${app.name}`} />

                {/* সোশ্যাল মিডিয়ার জন্য (Open Graph) */}
                <meta property="og:title" content={`${app.name} Mod APK Download`} />
                <meta property="og:description" content={app.mainDescription?.substring(0, 100)} />
                <meta property="og:image" content={`http://localhost:5000/${app.icon_path}`} />
            </Helmet>

            {/* --- HEADER SECTION --- */}
            <header className="details-header">
                <div className="container header-flex">
                    <img src={`http://localhost:5000/${app.icon_path}`} alt={app.name} className="main-app-icon" />
                    <div className="app-title-area">
                        <h1>{app.name}</h1>
                        <p className="category-text"><Layers size={14} /> {app.category}</p>
                        <div className="badge-row">
                            <span className="version-badge">v{app.version}</span>
                            <span className="rating-badge"><Star size={14} /> {app.rating || "4.8"}</span>
                        </div>
                    </div>
                    <button className="download-btn-top" onClick={handleFinalDownload}>
                        <Download size={18} /> Download APK
                    </button>
                </div>
            </header>

            <main className="container main-layout">
                <div className="left-content">

                    {/* 📸 SCREENSHOTS */}
                    <section className="screenshots-section">
                        <h2><Smartphone size={18} /> App Screenshots</h2>
                        {app.screenshots?.length > 0 && (
                            <Swiper modules={[Navigation, Pagination, Autoplay]} spaceBetween={15} slidesPerView={1.5} navigation pagination={{ clickable: true }} breakpoints={{ 640: { slidesPerView: 2.5 }, 1024: { slidesPerView: 3.5 } }}>
                                {app.screenshots.map((screen, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={`http://localhost:5000/${screen}`} alt={`${app.name} Screenshot ${index + 1}`} loading="lazy" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </section>

                    {/* --- SEO SECTIONS (Server Data) --- */}

                    {/* 1. Intro Description */}
                    <section className="seo-card">
                        <h2><Info size={20} /> What is {app.name} APK?</h2>
                        <div className="content-p">
                            <p>{app.mainDescription || "No description available."}</p>
                        </div>
                    </section>

                    {/* 2. Main Features (Split by Newline) */}
                    <section className="seo-card">
                        <h2><Star size={20} /> Features of {app.name} Mod</h2>
                        <ul className="feature-list">
                            {app.features?.split('\n').map((item, i) => (
                                item.trim() && <li key={i}><CheckCircle size={14} className="check-icon" /> {item}</li>
                            ))}
                        </ul>
                    </section>

                    {/* 3. Why Choose */}
                    <section className="seo-card">
                        <h2><ShieldCheck size={20} /> Why Download From Us?</h2>
                        <div className="content-p">
                            <p>{app.whyChoose || "We provide 100% safe and tested APKs."}</p>
                        </div>
                    </section>

                    {/* 4. Installation Guide (Split by Newline) */}
                    <section className="seo-card">
                        <h2><Download size={20} /> How to Install {app.name}?</h2>
                        <div className="install-steps">
                            {app.howToInstall?.split('\n').map((step, i) => (
                                step.trim() && (
                                    <div className="step-box" key={i}>
                                        <span className="step-number">{i + 1}</span>
                                        <p>{step}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    </section>
                </div>

                {/* --- SIDEBAR --- */}
                <aside className="sidebar">
                    <div className="requirements-card">
                        <h3><Cpu size={18} /> System Requirements</h3>
                        <ul>
                            <li><CheckCircle size={14} className="icon" /> <strong>OS:</strong> {app.requirements || "Android 8.0+"}</li>
                            <li><CheckCircle size={14} className="icon" /> <strong>Status:</strong> Safe & Tested</li>
                        </ul>
                    </div>

                    <button className="final-download-btn" onClick={handleFinalDownload}>
                        <Download size={22} />
                        <div>
                            <span>Download Now</span>
                            <small>v{app.version} | Mod Unlocked</small>
                        </div>
                    </button>
                </aside>
            </main>

            {/* --- AD MODAL --- */}
            {showAd && (
                <AdModal onClose={() => setShowAd(false)} downloadLink={`http://localhost:5000/${app.app_path}`} />
            )}
        </div>
    );
};