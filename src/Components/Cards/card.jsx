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

    // অ্যাড পপ-আপ লজিক
    useEffect(() => {
        let timer;
        if (showAd && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            if (timeLeft <= 5) setCanClose(true);
        } else if (showAd && timeLeft === 0) {
            handleCloseAd(); 
        }

        return () => clearInterval(timer);
    }, [showAd, timeLeft]);

    const handleDownloadClick = () => {
        setShowAd(true);
        setTimeLeft(10);
        setCanClose(false);
    };

    const handleCloseAd = () => {
        setShowAd(false);
        // ডাউনলোড লিংকের বদলে এখন ডিটেইলস পেজে রিডাইরেক্ট হবে
        navigate(`/app/${id}`); 
    };

    return (
        <>
            <div 
                ref={cardRef} 
                className={`Card-Body ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}
            >
                {/* --- কার্ডের মেইন ইমেজ (স্ক্রিনশট) --- */}
                <div className="img-container" onClick={() => navigate(`/app/${id}`)}>
                    {/* ডাটাবেস থেকে আসা স্ক্রিনশট */}
                    <img 
                        src={screenshotImg || "minecraft_screen.jpg"} 
                        alt={`${title} screenshot`} 
                        loading="lazy" 
                        className="screenshot"
                    />
                    
                    {/* রেটিং এবং ডাউনলোড ব্যাজ --- */}
                    <div className="card-meta">
                        {rating && (
                            <span className="rating-badge">
                                <Star size={12} className="star-icon" /> 
                                {rating}
                            </span>
                        )}
                        {downloads && (
                            <span className="download-badge">
                                {downloads}
                            </span>
                        )}
                    </div>
                </div>

                {/* --- কার্ডের নিচের অংশ (আইকন, নাম, ডাউনলোড বাটন) --- */}
                <div className="card-bottom">
                    <div className="app-main-info" onClick={() => navigate(`/app/${id}`)}>
                        {/* ছোট অ্যাপ আইকন */}
                        <img 
                            src={iconImg || "app_icon_placeholder.png"} 
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

            {/* --- Pop-up Ad Overlay --- */}
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
                                     {/* এইখানে তোমার AdSense কোড বসবে */}
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