import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, X, Clock, Star } from "lucide-react";
import './card.scss';
import useReveal from "../../Hooks/useScrollAnimation";

export default function Card({ id, title, iconImg, screenshotImg, rating, downloads, category }) {
    const [cardRef, isVisible] = useReveal(0.15);
    const [showAd, setShowAd] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [canClose, setCanClose] = useState(false);
    
    const navigate = useNavigate();
    const BASE_URL = "https://crackmods.onrender.com/"; // হার্ডকোড করা লিঙ্ক

    useEffect(() => {
        let timer;
        if (showAd) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleCloseAd();
                        return 0;
                    }
                    // ৫ সেকেন্ড পার হলে ক্লোজ বাটন দেখাবে
                    if (prev <= 6) setCanClose(true); 
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showAd]);

    const handleDownloadClick = (e) => {
        e.stopPropagation(); // কার্ডের মেইন ক্লিক যেন ট্রিগার না হয়
        setShowAd(true);
        setTimeLeft(10);
        setCanClose(false);
    };

    const handleCloseAd = () => {
        setShowAd(false);
        navigate(`/app/${id}`); 
    };

    // ইমেজ পাথ চেক করার ফাংশন
    const getFullImgPath = (path) => {
        if (!path) return "placeholder.png";
        return path.startsWith('http') ? path : `${BASE_URL}${path}`;
    };

    return (
        <>
            <div 
                ref={cardRef} 
                className={`Card-Body ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}
            >
                <div className="img-container" onClick={() => navigate(`/app/${id}`)}>
                    <img 
                        src={getFullImgPath(screenshotImg)} 
                        alt={`${title} screenshot`} 
                        loading="lazy" 
                        className="screenshot"
                    />
                    
                    <div className="card-meta">
                        {rating && <span className="rating-badge"><Star size={12}/> {rating}</span>}
                        {downloads && <span className="download-badge">{downloads}</span>}
                    </div>
                </div>

                <div className="card-bottom">
                    <div className="app-main-info" onClick={() => navigate(`/app/${id}`)}>
                        <img 
                            src={getFullImgPath(iconImg)} 
                            alt={`${title} icon`} 
                            className="app-icon-mini"
                        />
                        <div className="text-info">
                            <h3>{title || "Minecraft"}</h3>
                            {category && <span className="category-text">{category}</span>}
                        </div>
                    </div>
                    
                    <button className="download-btn" onClick={handleDownloadClick}>
                        <Download size={18}/>
                        <span>Get</span>
                    </button>
                </div>
            </div>

            {showAd && (
                <div className="ad-overlay">
                    <div className="ad-modal">
                        <div className="ad-header">
                            <span><Clock size={14}/> Redirecting in {timeLeft}s</span>
                            {canClose && (
                                <button className="close-ad-btn" onClick={handleCloseAd}>
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        
                        <div className="ad-content">
                            <div className="placeholder-ad">
                                <p className="ad-notice">SPONSORED ADVERTISEMENT</p>
                                <div className="ad-box-display">
                                     <p>Google Ad Display Area</p>
                                </div>
                            </div>
                        </div>

                        <div className="ad-footer-progress">
                            <div className="progress-bar" style={{ width: `${(timeLeft / 10) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}