import './footer.scss';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  return (
    <footer className="Footer">
      <div className="footer-container">
        {/* Features Section */}
        <div className="footer-section features-section">
          <h3>Our Features</h3>
          <ul>
            <li>✨ Modern Design</li>
            <li>⚡ Fast Downloads</li>
            <li>🔒 Completely Safe</li>
            <li>🌐 Cloud Sync</li>
            <li>📱 Works on All Devices</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-section links-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/category/tools">Tools</a></li>
            <li><a href="/category/games">Games</a></li>
            <li><a href="/category/entertainment">Entertainment</a></li>
            
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact-section">
          <h3>Get in Touch</h3>
          <p>📧 support@crackmods.com</p>
          <p>📱 +88 01XXXXXXXXX</p>
          <p>🏢 Bangladesh, Dhaka</p>
        </div>

        {/* Social Links */}
        <div className="footer-section social-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="#twitter" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="#instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#youtube" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} CrackMods. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <span>|</span>
          <a href="/terms">Terms of Service</a>
          <span>|</span>
          <a href="#disclaimer">Disclaimer</a>
        </div>
      </div>
    </footer>
  );
}
