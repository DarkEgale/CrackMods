import { useParams, useNavigate } from 'react-router-dom';
import { appsData } from '../../Data/appsData';
import './appDetail.scss';
import { useState } from 'react';

export default function AppDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  const app = appsData.find(item => item.id === parseInt(id));

  if (!app) {
    return (
      <div className="app-detail-error">
        <h2>App Not Found</h2>
        <p>Sorry, we couldn't find the app you're looking for.</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate download process
    setTimeout(() => {
      alert(`${app.name} download started!`);
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <div className="app-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Go Back
        </button>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        {/* App Header Section */}
        <div className="app-header">
          <div className="app-banner">
            <img src={app.image} alt={app.name} />
          </div>

          <div className="app-info">
            <h1>{app.name}</h1>
            <div className="app-meta">
              <span className="category">{app.category}</span>
              <span className="rating">⭐ {app.rating}</span>
              <span className="downloads">📥 {app.downloads}</span>
            </div>
            <p className="description">{app.description}</p>

            {/* Download Button */}
            <button 
              className="download-btn" 
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : '⬇️ Download App'}
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="details-grid">
          {/* Info Card */}
          <div className="info-card">
            <h3>App Information</h3>
            <div className="info-item">
              <span className="label">Version:</span>
              <span className="value">{app.version}</span>
            </div>
            <div className="info-item">
              <span className="label">File Size:</span>
              <span className="value">{app.fileSize}</span>
            </div>
            <div className="info-item">
              <span className="label">Requirements:</span>
              <span className="value">{app.requirements}</span>
            </div>
          </div>

          {/* Features Card */}
          <div className="features-card">
            <h3>Key Features</h3>
            <ul>
              {app.features.map((feature, index) => (
                <li key={index}>✨ {feature}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Points/Benefits Section */}
        <div className="points-section">
          <h2>Why Use This App?</h2>
          <div className="points-grid">
            {app.points.map((point, index) => (
              <div className="point-card" key={index}>
                <div className="point-icon">💡</div>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <h3>Get Started Today</h3>
          <p>Download this incredible app now and transform your experience.</p>
          <button 
            className="cta-btn" 
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : '🚀 Download Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
