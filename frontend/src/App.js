import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Simple HomePage component
const HomePage = () => (
  <div className="landing-page">
    <nav className="navbar">
      <div className="logo">🏠 VP System</div>
      <div className="nav-buttons">
        <a href="/register" className="nav-button register">Register</a>
        <a href="/login" className="nav-button login">🔐 Login</a>
      </div>
    </nav>

    <div className="hero-section">
      <h1 className="hero-title">AI-Powered Valuation System</h1>
      <p className="hero-subtitle">Professional Property Valuation Reports with AI Technology</p>

      <div className="cta-buttons">
        <a href="/register" className="cta-button primary">Get Started - Register Now</a>
        <a href="/login" className="cta-button secondary">🔐 Login to Dashboard</a>
      </div>
    </div>

    <div className="features-section">
      <h2 className="features-title">Professional Features</h2>
      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon" style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '24px',
            color: 'white',
            fontWeight: 'bold'
          }}>ID</div>
          <h3 className="feature-title">IVSL Registration</h3>
          <p className="feature-description">Complete professional valuer registration with IVSL compliance</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon" style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '24px',
            color: 'white',
            fontWeight: 'bold'
          }}>DB</div>
          <h3 className="feature-title">Professional Dashboard</h3>
          <p className="feature-description">Comprehensive dashboard for managing valuation reports</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon" style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '24px',
            color: 'white',
            fontWeight: 'bold'
          }}>AI</div>
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

// Working RegisterPage
const RegisterPage = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    honorable: '',
    professional_title: '',
    ivsl_registration: '',
    phone_number: '',
    mobile_number: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.full_name) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-page">
        <div className="form-container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
          <h2>Registration Successful!</h2>
          <p>Your account has been created successfully.</p>
          <a href="/login" className="form-button" style={{
            display: 'inline-block',
            textDecoration: 'none',
            marginTop: '20px'
          }}>
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <h1 className="form-title">Professional Valuer Registration</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <select
              className="form-input"
              value={formData.honorable}
              onChange={(e) => setFormData({...formData, honorable: e.target.value})}
            >
              <option value="">Select</option>
              <option value="Dr">Dr</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Professional Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.professional_title}
              onChange={(e) => setFormData({...formData, professional_title: e.target.value})}
              placeholder="e.g., Chartered Valuation Surveyor"
            />
          </div>

          <div className="form-group">
            <label className="form-label">IVSL Registration Number</label>
            <input
              type="text"
              className="form-input"
              value={formData.ivsl_registration}
              onChange={(e) => setFormData({...formData, ivsl_registration: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className="form-input"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                placeholder="+94 11 234 5678"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-input"
                value={formData.mobile_number}
                onChange={(e) => setFormData({...formData, mobile_number: e.target.value})}
                placeholder="+94 77 123 4567"
              />
            </div>
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="form-link">
          Already have an account? <a href="/login">Sign in here</a>
        </div>
      </div>
    </div>
  );
};

// Working LoginPage
const LoginPage = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile?email=${formData.email}`);
      const data = await response.json();

      if (data.success && data.user) {
        // Store user and redirect to dashboard
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        window.location.href = `/dashboard?userId=${data.user.id}`;
      } else {
        setError('User not found. Please register first.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h1 className="form-title">🔐 Valuer Login</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div className="form-link">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </div>
    </div>
  );
};

// Working DashboardPage
const DashboardPage = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get user from localStorage or URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    if (userId) {
      fetchUser(userId);
    } else {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, []);

  const fetchUser = async (userId) => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/api/auth/profile?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
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
          <h2>Access Denied</h2>
          <p>Please log in to access your dashboard</p>
          <a href="/login" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '10px 20px',
            border: '2px solid white',
            borderRadius: '10px'
          }}>
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: '0', fontSize: '1.5rem' }}>
            {user.honorable && `${user.honorable} `}
            {user.full_name}
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>
            {user.professional_title || 'Professional Valuer'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '30px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '20px'
        }}>
          <h2>Professional Profile</h2>
          <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>IVSL Registration:</strong> {user.ivsl_registration || 'Not provided'}</div>
            <div><strong>Phone:</strong> {user.phone_number || 'Not provided'}</div>
            <div><strong>Mobile:</strong> {user.mobile_number || 'Not provided'}</div>
            <div><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          padding: '25px',
          textAlign: 'center'
        }}>
          <h3>Reports Dashboard</h3>
          <p>No reports created yet. Start creating your first professional valuation report.</p>
          <button style={{
            padding: '15px 30px',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            Create New Report
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;