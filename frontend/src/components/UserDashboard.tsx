import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

interface User {
  id: number;
  email: string;
  honorable?: string;
  full_name: string;
  professional_title?: string;
  qualifications?: string[];
  ivsl_registration?: string;
  professional_status?: string;
  ivsl_membership_type?: string;
  house_number?: string;
  street_name?: string;
  area_name?: string;
  city?: string;
  district?: string;
  phone_number?: string;
  mobile_number?: string;
  alternative_contact?: string;
  signature_path?: string;
  letterhead_path?: string;
  profile_picture_path?: string;
  email_verified: boolean;
  created_at: string;
}

interface DashboardProps {
  userId: number;
}

const UserDashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/profile?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatQualifications = (qualifications: string[] | string | undefined) => {
    if (!qualifications) return 'Not specified';
    if (typeof qualifications === 'string') {
      try {
        return JSON.parse(qualifications).join(', ');
      } catch {
        return qualifications;
      }
    }
    return qualifications.join(', ');
  };

  const formatAddress = (user: User) => {
    const addressParts = [
      user.house_number,
      user.street_name,
      user.area_name,
      user.city,
      user.district
    ].filter(Boolean);

    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not provided';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>❌ Error</h3>
          <p>{error || 'User not found'}</p>
          <button onClick={fetchUserProfile} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="profile-summary">
          <div className="profile-picture">
            {user.profile_picture_path ? (
              <img src={user.profile_picture_path} alt="Profile" />
            ) : (
              <div className="profile-placeholder">
                {user.honorable && `${user.honorable} `}
                {user.full_name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>
              {user.honorable && `${user.honorable} `}
              {user.full_name}
            </h1>
            <p className="professional-title">{user.professional_title || 'Professional Valuer'}</p>
            <div className="verification-status">
              {user.email_verified ? (
                <span className="verified">✅ Email Verified</span>
              ) : (
                <span className="unverified">⚠️ Email Verification Pending</span>
              )}
              {user.ivsl_registration && (
                <span className="ivsl-reg">🏛️ IVSL Reg: {user.ivsl_registration}</span>
              )}
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <button className="action-button primary">
            📝 New Valuation Report
          </button>
          <button className="action-button secondary">
            📁 View Reports
          </button>
          <button className="action-button secondary">
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile Details
        </button>
        <button
          className={`tab-button ${activeTab === 'credentials' ? 'active' : ''}`}
          onClick={() => setActiveTab('credentials')}
        >
          🎓 Credentials
        </button>
        <button
          className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📋 Reports
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>📊 Reports Created</h3>
                <div className="stat-number">0</div>
                <p>Total valuation reports</p>
              </div>
              <div className="stat-card">
                <h3>⏱️ This Month</h3>
                <div className="stat-number">0</div>
                <p>Reports this month</p>
              </div>
              <div className="stat-card">
                <h3>✅ Completed</h3>
                <div className="stat-number">0</div>
                <p>Finalized reports</p>
              </div>
              <div className="stat-card">
                <h3>📝 Draft</h3>
                <div className="stat-number">0</div>
                <p>Work in progress</p>
              </div>
            </div>

            <div className="recent-activity">
              <h3>🕒 Recent Activity</h3>
              <div className="activity-list">
                <p className="no-activity">No recent activity</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-tab">
            <div className="profile-sections">
              <div className="profile-section">
                <h3>👤 Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name:</label>
                    <span>{user.honorable && `${user.honorable} `}{user.full_name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{user.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Professional Title:</label>
                    <span>{user.professional_title || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <label>Professional Status:</label>
                    <span>{user.professional_status || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>📍 Contact Information</h3>
                <div className="info-grid">
                  <div className="info-item full-width">
                    <label>Address:</label>
                    <span>{formatAddress(user)}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{user.phone_number || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <label>Mobile:</label>
                    <span>{user.mobile_number || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <label>Alternative Contact:</label>
                    <span>{user.alternative_contact || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'credentials' && (
          <div className="credentials-tab">
            <div className="credentials-sections">
              <div className="credentials-section">
                <h3>🎓 Professional Qualifications</h3>
                <div className="qualifications-list">
                  {formatQualifications(user.qualifications)}
                </div>
              </div>

              <div className="credentials-section">
                <h3>🏛️ IVSL Registration</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Registration Number:</label>
                    <span>{user.ivsl_registration || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <label>Membership Type:</label>
                    <span>{user.ivsl_membership_type || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="credentials-section">
                <h3>📄 Professional Documents</h3>
                <div className="documents-grid">
                  <div className="document-item">
                    <label>Digital Signature:</label>
                    {user.signature_path ? (
                      <span className="document-uploaded">✅ Uploaded</span>
                    ) : (
                      <span className="document-missing">❌ Not uploaded</span>
                    )}
                  </div>
                  <div className="document-item">
                    <label>Letterhead Template:</label>
                    {user.letterhead_path ? (
                      <span className="document-uploaded">✅ Uploaded</span>
                    ) : (
                      <span className="document-missing">❌ Not uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-tab">
            <div className="reports-header">
              <h3>📋 Valuation Reports</h3>
              <button className="create-report-button">
                ➕ Create New Report
              </button>
            </div>
            <div className="reports-list">
              <p className="no-reports">No reports created yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;