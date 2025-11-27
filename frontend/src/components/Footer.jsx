import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">TB Detection Platform</h3>
          <p className="footer-description">
            Advancing healthcare through AI-powered tuberculosis detection
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/get-health">Health Check</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Technology</h4>
          <ul className="footer-links">
            <li>Machine Learning</li>
            <li>Medical Imaging</li>
            <li>AI Diagnostics</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <div className="contact-info">
            <div className="contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-10 5L2 7"/>
              </svg>
              <span>contact@tbdetection.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} TB Detection Platform. All rights reserved.</p>
          <div className="footer-badges">
            <span className="badge">AI Powered</span>
            <span className="badge">Healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;