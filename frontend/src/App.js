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
              <option value="Vlr">Vlr</option>
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
  const [showProfileEdit, setShowProfileEdit] = React.useState(false);
  const [editFormData, setEditFormData] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [editError, setEditError] = React.useState('');

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
        {/* Profile Completeness Alert */}
        {(!user.ivsl_registration || !user.professional_title || !user.phone_number || !user.mobile_number) && (
          <div style={{
            background: 'linear-gradient(45deg, #FF9800, #F57C00)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>⚠️ Complete Your Professional Profile</h3>
            <p style={{ margin: '0 0 15px 0', opacity: 0.9 }}>
              Add your professional details to generate comprehensive valuation reports
            </p>
            <button
              onClick={() => setShowProfileEdit(true)}
              style={{
                padding: '10px 25px',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid white',
                color: 'white',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Complete Profile Now
            </button>
          </div>
        )}

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '0' }}>Professional Profile</h2>
            <button
              onClick={() => setShowProfileEdit(true)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ✏️ Edit Profile
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 15px 0', color: '#4ECDC4' }}>Personal Information</h4>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                <div><strong>Full Name:</strong> {user.honorable && `${user.honorable} `}{user.full_name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Professional Title:</strong> {user.professional_title || <em style={{color: '#FF9800'}}>Not provided</em>}</div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 15px 0', color: '#4ECDC4' }}>Professional Details</h4>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                <div><strong>IVSL Registration:</strong> {user.ivsl_registration || <em style={{color: '#FF9800'}}>Not provided</em>}</div>
                <div><strong>Membership Type:</strong> {user.ivsl_membership_type || <em style={{color: '#FF9800'}}>Not provided</em>}</div>
                <div><strong>Professional Status:</strong> {user.professional_status || <em style={{color: '#FF9800'}}>Not provided</em>}</div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 15px 0', color: '#4ECDC4' }}>Contact Information</h4>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                <div><strong>Phone:</strong> {user.phone_number || <em style={{color: '#FF9800'}}>Not provided</em>}</div>
                <div><strong>Mobile:</strong> {user.mobile_number || <em style={{color: '#FF9800'}}>Not provided</em>}</div>
                <div><strong>Alternative:</strong> {user.alternative_contact || <em style={{color: '#FF9800'}}>Not provided</em>}</div>
              </div>
            </div>
          </div>

          {/* Profile Completeness Bar */}
          <div style={{ marginTop: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: '0', fontSize: '1rem' }}>Profile Completeness</h4>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4ECDC4' }}>
                {Math.round(((user.professional_title ? 1 : 0) +
                           (user.ivsl_registration ? 1 : 0) +
                           (user.phone_number ? 1 : 0) +
                           (user.mobile_number ? 1 : 0) +
                           (user.professional_status ? 1 : 0) +
                           (user.ivsl_membership_type ? 1 : 0)) / 6 * 100)}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((user.professional_title ? 1 : 0) +
                          (user.ivsl_registration ? 1 : 0) +
                          (user.phone_number ? 1 : 0) +
                          (user.mobile_number ? 1 : 0) +
                          (user.professional_status ? 1 : 0) +
                          (user.ivsl_membership_type ? 1 : 0)) / 6 * 100}%`,
                height: '100%',
                background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
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

        {/* Profile Edit Modal */}
        {showProfileEdit && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflowY: 'auto',
              color: 'white',
              width: '90%'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ margin: '0' }}>✏️ Edit Professional Profile</h2>
                <button
                  onClick={() => {setShowProfileEdit(false); setEditError('');}}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '20px'
                  }}
                >
                  ×
                </button>
              </div>

              {editError && (
                <div style={{
                  background: 'rgba(255,0,0,0.3)',
                  border: '1px solid rgba(255,0,0,0.5)',
                  borderRadius: '10px',
                  padding: '15px',
                  marginBottom: '20px',
                  color: 'white'
                }}>
                  {editError}
                </div>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setEditError('');

                try {
                  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                  const response = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, ...editFormData })
                  });

                  const data = await response.json();

                  if (data.success) {
                    setUser({ ...user, ...editFormData });
                    setShowProfileEdit(false);
                    setEditFormData({});
                  } else {
                    setEditError(data.error || 'Failed to update profile');
                  }
                } catch (err) {
                  setEditError('Network error occurred');
                } finally {
                  setSaving(false);
                }
              }}>

                {/* Personal Information Section */}
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{ color: '#4ECDC4', marginBottom: '15px' }}>👤 Personal Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>Title</label>
                      <select
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        value={editFormData.honorable || user.honorable || ''}
                        onChange={(e) => setEditFormData({...editFormData, honorable: e.target.value})}
                      >
                        <option value="" style={{ color: 'black' }}>Select</option>
                        <option value="Vlr" style={{ color: 'black' }}>Vlr</option>
                        <option value="Dr" style={{ color: 'black' }}>Dr</option>
                        <option value="Mr" style={{ color: 'black' }}>Mr</option>
                        <option value="Mrs" style={{ color: 'black' }}>Mrs</option>
                        <option value="Ms" style={{ color: 'black' }}>Ms</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>Full Name</label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        value={editFormData.full_name || user.full_name || ''}
                        onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>Professional Title</label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="e.g., Chartered Valuation Surveyor"
                        value={editFormData.professional_title || user.professional_title || ''}
                        onChange={(e) => setEditFormData({...editFormData, professional_title: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Details Section */}
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{ color: '#4ECDC4', marginBottom: '15px' }}>🏛️ Professional Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>IVSL Registration Number</label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="e.g., VL/001/2024"
                        value={editFormData.ivsl_registration || user.ivsl_registration || ''}
                        onChange={(e) => setEditFormData({...editFormData, ivsl_registration: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>IVSL Membership Type</label>
                      <select
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        value={editFormData.ivsl_membership_type || user.ivsl_membership_type || ''}
                        onChange={(e) => setEditFormData({...editFormData, ivsl_membership_type: e.target.value})}
                      >
                        <option value="" style={{ color: 'black' }}>Select Membership</option>
                        <option value="Fellow" style={{ color: 'black' }}>Fellow (FIVSL)</option>
                        <option value="Member" style={{ color: 'black' }}>Member (MIVSL)</option>
                        <option value="Associate" style={{ color: 'black' }}>Associate (AIVSL)</option>
                        <option value="Student" style={{ color: 'black' }}>Student Member</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>Professional Status</label>
                      <select
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        value={editFormData.professional_status || user.professional_status || ''}
                        onChange={(e) => setEditFormData({...editFormData, professional_status: e.target.value})}
                      >
                        <option value="" style={{ color: 'black' }}>Select Status</option>
                        <option value="Licensed Valuer" style={{ color: 'black' }}>Licensed Valuer</option>
                        <option value="Provisional Valuer" style={{ color: 'black' }}>Provisional Valuer</option>
                        <option value="Trainee Valuer" style={{ color: 'black' }}>Trainee Valuer</option>
                        <option value="Consulting Valuer" style={{ color: 'black' }}>Consulting Valuer</option>
                      </select>
                    </div>
                  </div>
                </div>


                {/* Qualifications Section */}
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{ color: '#4ECDC4', marginBottom: '15px' }}>🎓 Professional Qualifications</h3>
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '600' }}>
                      Add Your Qualifications (one by one for proper report formatting)
                    </label>

                    {/* Display current qualifications */}
                    <div style={{ marginBottom: '15px' }}>
                      {(() => {
                        const currentQuals = editFormData.qualifications ||
                          (typeof user.qualifications === 'string' ?
                            user.qualifications.split(',').map(q => q.trim()).filter(Boolean) :
                            user.qualifications || []);

                        return currentQuals.map((qual, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            marginBottom: '5px',
                            border: '1px solid rgba(255,255,255,0.2)'
                          }}>
                            <span style={{ flex: 1, fontSize: '14px' }}>{qual}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newQuals = currentQuals.filter((_, i) => i !== index);
                                setEditFormData({...editFormData, qualifications: newQuals});
                              }}
                              style={{
                                background: 'rgba(255,0,0,0.3)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Add new qualification */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="e.g., B.Sc. (Hons.) Estate Management"
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const newQual = e.target.value.trim();
                            if (newQual) {
                              const currentQuals = editFormData.qualifications ||
                                (typeof user.qualifications === 'string' ?
                                  user.qualifications.split(',').map(q => q.trim()).filter(Boolean) :
                                  user.qualifications || []);
                              setEditFormData({
                                ...editFormData,
                                qualifications: [...currentQuals, newQual]
                              });
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          const newQual = input.value.trim();
                          if (newQual) {
                            const currentQuals = editFormData.qualifications ||
                              (typeof user.qualifications === 'string' ?
                                user.qualifications.split(',').map(q => q.trim()).filter(Boolean) :
                                user.qualifications || []);
                            setEditFormData({
                              ...editFormData,
                              qualifications: [...currentQuals, newQual]
                            });
                            input.value = '';
                          }
                        }}
                        style={{
                          padding: '10px 20px',
                          background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        Add
                      </button>
                    </div>

                    <div style={{ fontSize: '12px', opacity: '0.8', marginTop: '8px' }}>
                      Common qualifications: B.Sc. Estate Management, M.Sc. REM, M.R.I.C.S., F.I.V.S.L., F.P.C.S.
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{ color: '#4ECDC4', marginBottom: '15px' }}>📞 Contact Information (For Report Letterhead)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>
                        Telephone <span style={{ color: '#FF9800' }}>*Required for Reports</span>
                      </label>
                      <input
                        type="tel"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="+94 11 234 5678"
                        value={editFormData.phone_number || user.phone_number || ''}
                        onChange={(e) => setEditFormData({...editFormData, phone_number: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>
                        Mobile <span style={{ color: '#FF9800' }}>*Required for Reports</span>
                      </label>
                      <input
                        type="tel"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="+94 77 123 4567"
                        value={editFormData.mobile_number || user.mobile_number || ''}
                        onChange={(e) => setEditFormData({...editFormData, mobile_number: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>Alternative Contact</label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="Alternative email or phone"
                        value={editFormData.alternative_contact || user.alternative_contact || ''}
                        onChange={(e) => setEditFormData({...editFormData, alternative_contact: e.target.value})}
                      />
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(76, 175, 80, 0.1)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '15px',
                    fontSize: '13px'
                  }}>
                    💡 <strong>Report Preview:</strong> Your contact details will appear in reports as:<br/>
                    <div style={{ fontFamily: 'monospace', marginTop: '5px', paddingLeft: '15px' }}>
                      Telephone: {editFormData.phone_number || user.phone_number || '[Not provided]'}<br/>
                      Mobile: {editFormData.mobile_number || user.mobile_number || '[Not provided]'}<br/>
                      E-mail: {user.email}
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ color: '#4ECDC4', marginBottom: '15px' }}>🏠 Address Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>House Number</label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="123/A"
                        value={editFormData.house_number || user.house_number || ''}
                        onChange={(e) => setEditFormData({...editFormData, house_number: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>Street Name</label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="Galle Road"
                        value={editFormData.street_name || user.street_name || ''}
                        onChange={(e) => setEditFormData({...editFormData, street_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>Area/Locality</label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="Bambalapitiya"
                        value={editFormData.area_name || user.area_name || ''}
                        onChange={(e) => setEditFormData({...editFormData, area_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>City</label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="Colombo"
                        value={editFormData.city || user.city || ''}
                        onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600' }}>District</label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder="Colombo"
                        value={editFormData.district || user.district || ''}
                        onChange={(e) => setEditFormData({...editFormData, district: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                  <button
                    type="button"
                    onClick={() => {setShowProfileEdit(false); setEditError(''); setEditFormData({});}}
                    style={{
                      padding: '12px 25px',
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: '12px 25px',
                      background: saving ? 'rgba(128,128,128,0.5)' : 'linear-gradient(45deg, #4ECDC4, #44A08D)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {saving ? 'Saving...' : '💾 Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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