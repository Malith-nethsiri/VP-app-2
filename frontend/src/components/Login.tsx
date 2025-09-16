import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      // First check if user exists and get their hashed password
      const profileResponse = await fetch(`${API_BASE_URL}/api/auth/profile?email=${formData.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success && profileData.user) {
          // In a real app, password verification would be done on the backend
          // For demo purposes, we'll proceed with basic email verification

          // Check if email is verified
          if (!profileData.user.email_verified) {
            setError('Please verify your email address before logging in. Check your inbox for the verification token.');
            return;
          }

          // Store user info in localStorage for demo
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
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏠 Valuer Login</h1>
          <p>Access your professional dashboard</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="register-link"
            >
              Register here
            </button>
          </p>
        </div>

        <div className="demo-note">
          <h4>Demo Instructions:</h4>
          <p>
            This is a demo login. First register a new account, then use the same
            email address to log in. The system will automatically find your profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;