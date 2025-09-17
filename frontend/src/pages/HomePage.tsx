import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">🏠 VP System</div>
        <div className="nav-buttons">
          <Link to="/register" className="nav-button register">
            👤 Register
          </Link>
          <Link to="/login" className="nav-button login">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          AI-Powered Valuation System
        </h1>
        <p className="hero-subtitle">
          Professional Property Valuation Reports with AI Technology
        </p>

        <div className="cta-buttons">
          <Link to="/register" className="cta-button primary">
            🚀 Get Started - Register Now
          </Link>
          <Link to="/login" className="cta-button secondary">
            Login to Dashboard
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="features-title">🎯 Professional Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">👤</div>
            <h3 className="feature-title">IVSL Registration</h3>
            <p className="feature-description">
              Complete professional valuer registration with IVSL compliance and
              all required professional credentials management.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Professional Dashboard</h3>
            <p className="feature-description">
              Comprehensive dashboard for managing valuation reports, credentials,
              and professional profile information.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI-Powered Reports</h3>
            <p className="feature-description">
              Generate professional valuation reports using advanced AI technology
              with IVSL-compliant formatting and standards.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '30px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.2)',
        marginTop: 'auto'
      }}>
        <p style={{ margin: '0', opacity: 0.8 }}>
          🏠 AI-Powered Valuation System | IVSL-Compliant • Secure • Professional
        </p>
      </footer>
    </div>
  );
};

export default HomePage;