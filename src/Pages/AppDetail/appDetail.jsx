import { useParams, useNavigate } from 'react-router-dom';
import { appsData } from '../../Data/appsData';
import './appDetail.scss';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async'; // SEO এর জন্য

export default function AppDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  const app = appsData.find(item => item.id === parseInt(id));

  if (!app) {
    return (
      <div className="app-detail-error">
        <h2>App Not Found</h2>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  // --- 💡 Google Schema Markup (JSON-LD) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": app.name,
    "operatingSystem": "ANDROID",
    "applicationCategory": "GameApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": app.rating,
      "reviewCount": app.downloads
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      alert(`${app.name} download started!`);
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <div className="app-detail-container">
      {/* --- 🚀 Helmet: Dynamic Meta Tags --- */}
      <Helmet>
        <title>{`${app.name} v${app.version} Download (Latest Mod) - Crack Mods`}</title>
        <meta name="description" content={`Download ${app.name} ${app.version} for Android. ${app.description.substring(0, 150)}...`} />
        <meta name="keywords" content={`${app.name} mod apk, download ${app.name}, ${app.category} apps, crack mods`} />
        
        {/* Open Graph (Facebook/WhatsApp Share) */}
        <meta property="og:title" content={`${app.name} Mod APK - Crack Mods`} />
        <meta property="og:description" content={app.description} />
        <meta property="og:image" content={app.image} />
        <meta property="og:url" content={`https://crack-mods.vercel.app/app/${app.id}`} />

        {/* Google Schema Script */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Go Back
        </button>
      </div>

      <div className="detail-content">
        <div className="app-header">
          <div className="app-banner">
            {/* Alt tag SEO optimized */}
            <img src={app.image} alt={`Download ${app.name} APK Mod`} title={`${app.name} Official Banner`} />
          </div>

          <div className="app-info">
            <h1 itemProp="name">{app.name}</h1>
            <div className="app-meta">
              <span className="category">📂 {app.category}</span>
              <span className="rating">⭐ {app.rating}</span>
              <span className="downloads">📥 {app.downloads}</span>
            </div>
            <p className="description">{app.description}</p>

            <button 
              className="download-btn" 
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? 'Processing...' : `⬇️ Download ${app.name} v${app.version}`}
            </button>
          </div>
        </div>

        {/* ... বাকি কোড একই থাকবে ... */}
      </div>
    </div>
  );
}