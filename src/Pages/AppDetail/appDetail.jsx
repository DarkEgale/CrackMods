import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './appDetail.scss';

export default function AppDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const API_BASE = "https://crackmods.onrender.com";

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/app-details/${id}`);
        const data = await response.json();
        if (data.success) {
          setApp(data.app);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loading-container"><h3>Loading...</h3></div>;
  if (!app) return <div className="error-container"><h3>App Not Found!</h3></div>;

  const handleDownload = () => {
    const adLink = "https://www.highcpmgate.com/your-ad-link"; 
    window.open(adLink, '_blank'); 

    setIsDownloading(true);
    setTimeout(() => {
      const downloadUrl = `${API_BASE}/${app.app_path}`;
      window.location.href = downloadUrl;
      setIsDownloading(false);
    }, 3000);
  };

  return (
    <div className="app-detail-page">
      <Helmet>
        <title>{`${app.name} v${app.version} Mod APK`}</title>
        <meta name="description" content={app.details?.substring(0, 150)} />
      </Helmet>

      <div className="main-wrapper">
        <div className="app-main-header">
          <div className="icon-area">
            <img src={`${API_BASE}/${app.icon_path}`} alt={app.name} onError={(e) => e.target.src = '/placeholder.png'} />
          </div>
          <div className="title-area">
            <h1>{app.name}</h1>
            <div className="meta-tags">
              <span>📂 {app.category}</span>
              <span>⭐ {app.rating}</span>
            </div>
            <button className="dl-btn" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? 'Generating Link...' : `Download Now (v${app.version})`}
            </button>
          </div>
        </div>

        <div className="content-body">
          <div className="section details-box">
            <h2>Description</h2>
            <div className="text-content">
              {app.details}
            </div>
          </div>

          {app.screenshots && app.screenshots.length > 0 && (
            <div className="section screenshot-box">
              <h2>Screenshots Fuck you</h2>
              <div className="screenshot-container">
                {app.screenshots.map((img, index) => (
                  <img key={index} src={`${API_BASE}/${img}`} alt="Preview" />
                ))}
              </div>
            </div>
          )}

          <div className="bottom-grid">
            <div className="grid-card">
              <h4>Features</h4>
              <p>{app.features}</p>
            </div>
            <div className="grid-card">
              <h4>Installation</h4>
              <p>{app.howToInstall}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}