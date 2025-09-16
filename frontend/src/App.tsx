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
        <div style={{position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px'}}>
          <Link
            to="/register"
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              textDecoration: 'none',
              color: 'white',
              background: 'rgba(255, 107, 107, 0.8)',
              fontWeight: '600',
              fontSize: '14px',
              border: '2px solid white'
            }}
          >
            👤 Register
          </Link>
          <Link
            to="/login"
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              textDecoration: 'none',
              color: 'white',
              background: 'rgba(78, 205, 196, 0.8)',
              fontWeight: '600',
              fontSize: '14px',
              border: '2px solid white'
            }}
          >
            🔐 Login
          </Link>
        </div>
        <h1>🏠 AI-Powered Valuation System</h1>
        <p>Professional Property Valuation Reports with AI Technology</p>

        <div className="status-section">
          <h2>🔧 System Status</h2>

          {loading && <div className="loading">⏳ Testing connectivity...</div>}
          {error && <div className="error">❌ Error: {error}</div>}

          {/* Backend Health Status */}
          {healthStatus && (
            <div className="status-card healthy">
              <h3>✅ Backend Status</h3>
              <p><strong>Status:</strong> {healthStatus.status}</p>
              <p><strong>Message:</strong> {healthStatus.message}</p>
              <p><strong>Version:</strong> {healthStatus.version}</p>
              <p><strong>Timestamp:</strong> {new Date(healthStatus.timestamp).toLocaleString()}</p>
            </div>
          )}

          {/* API Response */}
          {apiResponse && (
            <div className="status-card healthy">
              <h3>🔗 API Connectivity</h3>
              <p><strong>Message:</strong> {apiResponse.message}</p>
              <p><strong>Available Endpoints:</strong></p>
              <ul className="endpoint-list">
                {apiResponse.endpoints.map((endpoint, index) => (
                  <li key={index}>{endpoint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Test Results */}
          {aiTest && (
            <div className="status-card healthy">
              <h3>🤖 AI Service Test</h3>
              <p><strong>Status:</strong> {aiTest.success ? '✅ Working' : '❌ Failed'}</p>
              <p><strong>Message:</strong> {aiTest.message}</p>
              {aiTest.aiResponse && (
                <p><strong>AI Response:</strong> {aiTest.aiResponse}</p>
              )}
              <p><strong>Timestamp:</strong> {new Date(aiTest.timestamp).toLocaleString()}</p>
            </div>
          )}

          <div className="action-buttons">
            <button onClick={testBackendConnectivity} disabled={loading}>
              🔄 Refresh Status
            </button>
            <button onClick={testAIService} disabled={loading}>
              🤖 Test AI Services
            </button>
          </div>
        </div>

        <div className="info-section">
          <h2>📋 Deployment Information</h2>
          <div className="deployment-info">
            <p><strong>Frontend:</strong> Deployed on Vercel</p>
            <p><strong>Backend:</strong> Deployed on Railway</p>
            <p><strong>API URL:</strong> {API_BASE_URL}</p>
            <p><strong>Build Time:</strong> {new Date().toLocaleString()}</p>
            <p><strong>Version:</strong> v2.1 - Navigation Fixed</p>
            <p><strong>Commit:</strong> faa84b7</p>
          </div>
        </div>

        <div className="next-steps">
          <h2>🚀 System Features</h2>
          <ol>
            <li>✅ Backend deployed and running</li>
            <li>✅ Frontend deployed and running</li>
            <li>✅ API connectivity established</li>
            <li>✅ Enhanced user authentication with IVSL fields</li>
            <li>✅ Professional dashboard system</li>
            <li>✅ Database with PostgreSQL</li>
            <li>🔄 AI services integration</li>
            <li>⏳ Document upload functionality</li>
            <li>⏳ Report generation system</li>
          </ol>
        </div>

        <div className="demo-section" style={{backgroundColor: 'rgba(255,255,255,0.15)', padding: '30px', margin: '20px 0', borderRadius: '15px'}}>
          <h2 style={{color: 'white', marginBottom: '25px'}}>🎯 Professional Valuer System Demo</h2>
          <div className="demo-buttons" style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', margin: '25px 0'}}>
            <Link
              to="/register"
              className="demo-button primary"
              style={{
                padding: '15px 25px',
                borderRadius: '25px',
                textDecoration: 'none',
                color: 'white',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                fontWeight: '600',
                fontSize: '15px',
                minWidth: '200px',
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              👤 Professional Registration
            </Link>
            <Link
              to="/login"
              className="demo-button secondary"
              style={{
                padding: '15px 25px',
                borderRadius: '25px',
                textDecoration: 'none',
                color: 'white',
                background: 'linear-gradient(45deg, #4ECDC4, #45B7AA)',
                fontWeight: '600',
                fontSize: '15px',
                minWidth: '200px',
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              🔐 Valuer Login
            </Link>
            <Link
              to="/credentials"
              className="demo-button secondary"
              style={{
                padding: '15px 25px',
                borderRadius: '25px',
                textDecoration: 'none',
                color: 'white',
                background: 'linear-gradient(45deg, #6C5CE7, #5A4FCF)',
                fontWeight: '600',
                fontSize: '15px',
                minWidth: '200px',
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              🎓 Credentials Management
            </Link>
          </div>
          <p className="demo-note" style={{color: 'white', fontSize: '14px', opacity: 0.9}}>
            <strong>Note:</strong> Complete IVSL-compliant professional valuer registration
            and management system. Register first, then login to access your dashboard.
          </p>
        </div>
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