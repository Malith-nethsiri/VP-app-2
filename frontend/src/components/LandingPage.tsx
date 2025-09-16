import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Test backend connectivity on component mount
    const testBackend = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BASE_URL}/api/health`);
        console.log('Backend status:', response.ok ? 'healthy' : 'unhealthy');
      } catch (err) {
        console.log('Backend status: offline');
      }
    };
    testBackend();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
          🏠 VP System
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link
            to="/register"
            style={{
              padding: '12px 24px',
              borderRadius: '25px',
              textDecoration: 'none',
              color: 'white',
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease'
            }}
          >
            👤 Register
          </Link>
          <Link
            to="/login"
            style={{
              padding: '12px 24px',
              borderRadius: '25px',
              textDecoration: 'none',
              color: 'white',
              background: 'linear-gradient(45deg, #4ECDC4, #45B7AA)',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease'
            }}
          >
            🔐 Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        paddingTop: '120px',
        textAlign: 'center',
        padding: '120px 20px 50px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🏠 AI-Powered Valuation System
        </h1>
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
          marginBottom: '40px',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          Professional Property Valuation Reports with AI Technology
        </p>

        {/* Quick Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '60px'
        }}>
          <Link
            to="/register"
            style={{
              padding: '20px 40px',
              borderRadius: '30px',
              textDecoration: 'none',
              color: 'white',
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              fontWeight: '700',
              fontSize: '18px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              minWidth: '250px',
              display: 'inline-block',
              textAlign: 'center'
            }}
          >
            🚀 Get Started - Register Now
          </Link>
          <Link
            to="/login"
            style={{
              padding: '20px 40px',
              borderRadius: '30px',
              textDecoration: 'none',
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid white',
              fontWeight: '600',
              fontSize: '18px',
              minWidth: '200px',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              textAlign: 'center'
            }}
          >
            🔐 Login to Dashboard
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '40px',
        margin: '40px 20px',
        backdropFilter: 'blur(10px)',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>
          🎯 Professional Features
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👤</div>
            <h3 style={{ marginBottom: '10px' }}>IVSL Registration</h3>
            <p style={{ opacity: 0.9, fontSize: '14px' }}>Complete professional valuer registration with IVSL compliance</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📊</div>
            <h3 style={{ marginBottom: '10px' }}>Professional Dashboard</h3>
            <p style={{ opacity: 0.9, fontSize: '14px' }}>Comprehensive dashboard for managing valuation reports and credentials</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🤖</div>
            <h3 style={{ marginBottom: '10px' }}>AI-Powered Reports</h3>
            <p style={{ opacity: 0.9, fontSize: '14px' }}>Generate professional valuation reports using advanced AI technology</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        padding: '30px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <p style={{ fontSize: '14px', opacity: 0.8, margin: '0' }}>
          🏠 AI-Powered Valuation System | Professional Property Reports with AI Technology
        </p>
        <p style={{ fontSize: '12px', opacity: 0.6, margin: '10px 0 0 0' }}>
          IVSL-Compliant • Secure • Professional • v3.0 Landing Page
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;