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

            if (timeLeft <= 5) setCanClose(true);
        } else if (timeLeft === 0) {
            handleFinalRedirect();
        }

        return () => clearInterval(timer);
    }, [timeLeft]);

    // --- অ্যাড লোড করার ১০০% কার্যকর উপায় ---
    useEffect(() => {
        const adId = "8ba4c4f8adfef978106d9fce39912c16";
        
        const loadAd = () => {
            const container = document.getElementById(`container-${adId}`);
            // যদি কন্টেইনার পাওয়া যায় এবং এর ভেতরে আগে থেকে কিছু না থাকে
            if (container && container.innerHTML === "") {
                const script = document.createElement("script");
                script.src = `https://pl29009072.profitablecpmratenetwork.com/${adId}/invoke.js`;
                script.async = true;
                script.setAttribute("data-cfasync", "false");
                container.appendChild(script);
            }
        };

        // ৫০০০ মিলি-সেকেন্ড (০.৫ সেকেন্ড) ডিলে দিন যেন ডোম রেডি হয়
        const timer = setTimeout(loadAd, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleFinalRedirect = () => {
        onClose();
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
                        <p>Your download link is generating. Please wait...</p>
                        
                        <div className="ad-box-display">
                            {/* আইডি ঠিকমতো আছে কি না নিশ্চিত করুন */}
                            <div id="container-8ba4c4f8adfef978106d9fce39912c16"></div>
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