import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if user exists and get their profile
      const profileResponse = await fetch(`${API_BASE_URL}/api/auth/profile?email=${formData.email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success && profileData.user) {
          // Check if email is verified
          if (!profileData.user.email_verified) {
            setError('Please verify your email address before logging in.');
            return;
          }

          // Store user info for session
          localStorage.setItem('currentUser', JSON.stringify(profileData.user));
          navigate(`/dashboard?userId=${profileData.user.id}`);
        } else {
          setError('User not found. Please register first.');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h1 className="form-title">🔐 Valuer Login</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Access your professional dashboard
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="form-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div className="form-link">
          Don't have an account? <a href="/register">Register here</a>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#f5f5f5',
          borderRadius: '10px',
          fontSize: '14px',
          color: '#666'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Demo Instructions:</h4>
          <p style={{ margin: '0' }}>
            This is a demo login. First register a new account, then use the same
            email address to log in. The system will automatically find your profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;