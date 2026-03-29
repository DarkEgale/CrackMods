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
            handleFinalRedirect();
        }

        return () => clearInterval(timer);
    }, [timeLeft]);

    // --- অ্যাড লোড করার লজিক ---
    useEffect(() => {
        const adId = "8ba4c4f8adfef978106d9fce39912c16";
        const containerId = `container-${adId}`;
        
        const loadAd = () => {
            const container = document.getElementById(containerId);
            if (container && container.innerHTML === "") {
                const script = document.createElement("script");
                script.src = `https://pl29009072.profitablecpmratenetwork.com/${adId}/invoke.js`;
                script.async = true;
                script.setAttribute("data-cfasync", "false");
                container.appendChild(script);
            }
        };

        const timer = setTimeout(loadAd, 500);
        return () => clearTimeout(timer);
    }, []);

    // --- ফাইল ডাউনলোড করানোর সিকিউর মেথড ---
    const handleFinalRedirect = () => {
        if (downloadLink) {
            // ১. একটি ইনভিজিবল লিঙ্ক তৈরি করা
            const link = document.createElement('a');
            link.href = downloadLink;
            link.setAttribute('download', 'app.apk'); // ফাইল নেম ফোর্স করা
            document.body.appendChild(link);
            
            // ২. ক্লিক ট্রিগার করা
            link.click();
            
            // ৩. লিঙ্কটি রিমুভ করা
            document.body.removeChild(link);
        }
        onClose(); // মডাল বন্ধ করা
    };

    return (
        <div className="ad-overlay">
            <div className="ad-modal">
                <div className="ad-header">
                    <span>
                        <Clock size={14} style={{ marginRight: '5px' }} /> 
                        {timeLeft > 0 ? `Download starting in ${timeLeft}s` : "Ready to Download!"}
                    </span>
                    {canClose && (
                        <button className="close-ad-btn" onClick={onClose}>
                            <X size={18} />
                        </button>
                    )}
                </div>
                
                <div className="ad-content">
                    <div className="placeholder-ad">
                        <h3>SPONSORED ADVERTISEMENT</h3>
                        <p>Your premium mod apk is ready. Please wait a moment...</p>
                        
                        <div className="ad-box-display">
                            <div id="container-8ba4c4f8adipfef978106d9fce39912c16">
                                {/* অ্যাড এখানে লোড হবে */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* টাইমার শেষ হলে বাটন দেখাবে (অপশনাল কিন্তু ভালো) */}
                {timeLeft === 0 && (
                    <div className="download-action-area">
                        <button className="manual-download-btn" onClick={handleFinalRedirect}>
                            Click here if download doesn't start
                        </button>
                    </div>
                )}

                <div className="ad-footer-progress">
                    <div className="progress-bar" style={{ width: `${(timeLeft / 10) * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
};