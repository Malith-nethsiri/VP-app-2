import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Simple HomePage component
const HomePage = () => (
  <div className="landing-page">
    <nav className="navbar">
      <div className="logo">🏠 VP System</div>
      <div className="nav-buttons">
        <a href="/register" className="nav-button register">👤 Register</a>
        <a href="/login" className="nav-button login">🔐 Login</a>
      </div>
    </nav>

    <div className="hero-section">
      <h1 className="hero-title">🏠 AI-Powered Valuation System</h1>
      <p className="hero-subtitle">Professional Property Valuation Reports with AI Technology</p>

      <div className="cta-buttons">
        <a href="/register" className="cta-button primary">🚀 Get Started - Register Now</a>
        <a href="/login" className="cta-button secondary">🔐 Login to Dashboard</a>
      </div>
    </div>

    <div className="features-section">
      <h2 className="features-title">🎯 Professional Features</h2>
      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon">👤</div>
          <h3 className="feature-title">IVSL Registration</h3>
          <p className="feature-description">Complete professional valuer registration with IVSL compliance</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">📊</div>
          <h3 className="feature-title">Professional Dashboard</h3>
          <p className="feature-description">Comprehensive dashboard for managing valuation reports</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🤖</div>
          <h3 className="feature-title">AI-Powered Reports</h3>
          <p className="feature-description">Generate professional valuation reports using AI technology</p>
        </div>
      </div>
    </div>

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

// Simple message for other routes
const ComingSoon = ({ title }) => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center'
  }}>
    <div>
      <h1>🚧 {title}</h1>
      <p>This feature is coming soon!</p>
      <a href="/" style={{
        color: 'white',
        textDecoration: 'none',
        padding: '10px 20px',
        border: '2px solid white',
        borderRadius: '10px'
      }}>
        ← Back to Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<ComingSoon title="Professional Registration" />} />
        <Route path="/login" element={<ComingSoon title="Login System" />} />
        <Route path="/dashboard" element={<ComingSoon title="Professional Dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;