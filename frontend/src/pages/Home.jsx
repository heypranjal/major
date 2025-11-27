import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Advanced TB Detection with AI
          </h1>
          <p className="hero-subtitle">
            Using cutting-edge technology to detect tuberculosis symptoms from chest X-ray reports
          </p>
          <p className="hero-description">
            Our platform leverages artificial intelligence to analyse chest X-ray images and provide
            quick, accurate screening for tuberculosis symptoms. Simply upload your X-ray report
            to get instant analysis and insights.
          </p>
          <Link to="/get-health" className="cta-button">
            Start Detection
          </Link>
        </div>
        <div className="hero-image">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="50" width="300" height="300" rx="10" fill="none" stroke="#dc3545" strokeWidth="2" opacity="0.3"/>
            <rect x="80" y="80" width="240" height="240" rx="8" fill="rgba(220, 53, 69, 0.05)"/>
            <circle cx="200" cy="150" r="40" fill="none" stroke="#dc3545" strokeWidth="2" opacity="0.4"/>
            <circle cx="200" cy="250" r="40" fill="none" stroke="#dc3545" strokeWidth="2" opacity="0.4"/>
            <path d="M160 150 Q200 130 240 150" fill="none" stroke="#dc3545" strokeWidth="2" opacity="0.4"/>
            <path d="M160 250 Q200 270 240 250" fill="none" stroke="#dc3545" strokeWidth="2" opacity="0.4"/>
            <line x1="200" y1="110" x2="200" y2="290" stroke="#dc3545" strokeWidth="1" opacity="0.3"/>
          </svg>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V10H7V18Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 5V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Upload X-Ray</h3>
            <p>Simply upload your chest X-ray image in common formats (JPG, PNG, DICOM)</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>AI Analysis</h3>
            <p>Our advanced AI model analyses the image for tuberculosis indicators</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Get Results</h3>
            <p>Receive detailed analysis and recommendations within seconds</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-content">
          <h2>Important Information</h2>
          <div className="info-box">
            <p>
              This tool is designed to assist in preliminary screening and should not replace
              professional medical consultation. Always consult with a qualified healthcare
              provider for proper diagnosis and treatment.
            </p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>95%</h3>
              <p>Accuracy Rate</p>
            </div>
            <div className="stat-card">
              <h3>&lt;30s</h3>
              <p>Analysis Time</p>
            </div>
            <div className="stat-card">
              <h3>10K+</h3>
              <p>X-Rays Analysed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;