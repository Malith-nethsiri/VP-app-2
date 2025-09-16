import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useSearchParams, useNavigate } from 'react-router-dom';
import './App.css';

// Import components
import UserRegistration from './components/UserRegistration';
import UserDashboard from './components/UserDashboard';
import ProfessionalCredentials from './components/ProfessionalCredentials';
import Login from './components/Login';
import EmailVerification from './components/EmailVerification';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  version: string;
}

interface ApiResponse {
  message: string;
  timestamp: string;
  endpoints: string[];
}

// Dashboard Wrapper Component to handle user data
const DashboardWrapper: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  if (!userId) {
    return (
      <div className="error-container">
        <h2>❌ Access Denied</h2>
        <p>Please log in to access your dashboard</p>
        <Link to="/login" className="login-link">Go to Login</Link>
      </div>
    );
  }

  return <UserDashboard userId={parseInt(userId)} />;
};

// Credentials Wrapper Component
const CredentialsWrapper: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get user from localStorage or redirect to login
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return <ProfessionalCredentials user={user} onUpdate={handleUserUpdate} />;
};

// Home Component
const Home: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [aiTest, setAiTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test backend connectivity on component mount
  useEffect(() => {
    testBackendConnectivity();
  }, []);

  const testBackendConnectivity = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test health endpoint
      const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
      if (!healthResponse.ok) {
        throw new Error(`Health check failed: ${healthResponse.status}`);
      }
      const healthData = await healthResponse.json();
      setHealthStatus(healthData);

      // Test API endpoint
      const apiResponse = await fetch(`${API_BASE_URL}/api/test`);
      if (!apiResponse.ok) {
        throw new Error(`API test failed: ${apiResponse.status}`);
      }
      const apiData = await apiResponse.json();
      setApiResponse(apiData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Backend connectivity test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const testAIService = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true })
      });

      if (!response.ok) {
        throw new Error(`AI test failed: ${response.status}`);
      }

      const data = await response.json();
      setAiTest(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI test failed');
      console.error('AI service test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Navigation Bar */}
        <nav style={{
          position: 'absolute',
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
        <div style={{ marginTop: '100px', textAlign: 'center', padding: '50px 20px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            🏠 AI-Powered Valuation System
          </h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '40px', opacity: 0.9 }}>
            Professional Property Valuation Reports with AI Technology
          </p>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
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
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
                minWidth: '250px'
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
                transition: 'all 0.3s ease'
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
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>
            🎯 Professional Features
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👤</div>
              <h3>IVSL Registration</h3>
              <p>Complete professional valuer registration with IVSL compliance</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📊</div>
              <h3>Professional Dashboard</h3>
              <p>Comprehensive dashboard for managing valuation reports and credentials</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🤖</div>
              <h3>AI-Powered Reports</h3>
              <p>Generate professional valuation reports using advanced AI technology</p>
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
            IVSL-Compliant • Secure • Professional
          </p>
          {/* Optional: Add system status link for admins */}
          <button
            onClick={testBackendConnectivity}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.6)',
              padding: '5px 10px',
              borderRadius: '15px',
              fontSize: '11px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            🔧 System Status
          </button>
          {healthStatus && (
            <div style={{ fontSize: '11px', marginTop: '5px', opacity: 0.6 }}>
              Status: {healthStatus.status} | v2.2
            </div>
          )}
        </footer>
      </header>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<UserRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/credentials" element={<CredentialsWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;