import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './EmailVerification.css';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !token) {
      setError('Email and verification token are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Email verification failed');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
      console.error('Email verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="verification-container">
        <div className="verification-card">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Email Verified Successfully!</h2>
            <p>
              Your email has been verified. You can now log in to access your dashboard
              and start creating professional valuation reports.
            </p>
            <div className="action-buttons">
              <button
                className="login-button primary"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
              <button
                className="home-button secondary"
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <h1>📧 Email Verification</h1>
          <p>Please verify your email address to complete registration</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleVerification} className="verification-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="token">Verification Token</label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter verification token from email"
              required
            />
            <small className="form-hint">
              Check your email for the verification token
            </small>
          </div>

          <button
            type="submit"
            className="verify-button"
            disabled={loading}
          >
            {loading ? '⏳ Verifying...' : '✅ Verify Email'}
          </button>
        </form>

        <div className="verification-footer">
          <p>
            Didn't receive an email?{' '}
            <button
              type="button"
              className="resend-link"
              onClick={() => {
                // TODO: Implement resend verification email
                alert('Resend functionality will be implemented');
              }}
            >
              Resend verification email
            </button>
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="back-link"
          >
            ← Back to Login
          </button>
        </div>

        <div className="demo-note">
          <h4>Demo Instructions:</h4>
          <p>
            For demo purposes, you can use any email that was used during registration
            and enter any token value (e.g., "demo-token") to simulate email verification.
            The system will verify the email exists and mark it as verified.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;