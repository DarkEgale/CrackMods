import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import './adModel.scss';

export const AdModal = ({ onClose, downloadLink }) => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [canClose, setCanClose] = useState(false);

    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            // ৫ সেকেন্ড পর ক্লোজ বাটন দেখাবে
            if (timeLeft <= 5) setCanClose(true);
        } else if (timeLeft === 0) {
            handleFinalRedirect(); // ১০ সেকেন্ড শেষ হলে অটো ডাউনলোড
        }

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleFinalRedirect = () => {
        onClose(); // পপ-আপ ক্লোজ হবে
        // আসল ডাউনলোড শুরু হবে
        if (downloadLink) {
            window.location.href = downloadLink;
        }
    };

    return (
        <div className="ad-overlay">
            <div className="ad-modal">
                <div className="ad-header">
                    <span><Clock size={14}/> Download starting in {timeLeft}s</span>
                    {canClose && (
                        <button className="close-ad-btn" onClick={handleFinalRedirect}>
                            <X size={18} />
                        </button>
                    )}
                </div>
                
                <div className="ad-content">
                    <div className="placeholder-ad">
                        <h3>SPONSORED ADVERTISEMENT</h3>
                        <p>Please wait for {timeLeft} seconds. Your download is ready.</p>
                        <div className="ad-box-display">
                             {/* তোমার AdSense কোড বসবে */}
                             <p>Google Ad Display Area</p>
                        </div>
                    </div>
                </div>

                <div className="ad-footer-progress">
                    <div className="progress-bar" style={{ width: `${(timeLeft / 10) * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
};