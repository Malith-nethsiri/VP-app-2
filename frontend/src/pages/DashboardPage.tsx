import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

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
  email_verified: boolean;
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!userId) {
      setError('Access denied. Please log in.');
      setLoading(false);
      return;
    }
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

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>❌</div>
          <h3>Error</h3>
          <p>{error || 'User not found'}</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid white',
              color: 'white',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Back to Login
          </button>
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
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right', fontSize: '14px' }}>
            {user.email_verified ? (
              <span style={{ color: '#4CAF50' }}>✅ Email Verified</span>
            ) : (
              <span style={{ color: '#FF9800' }}>⚠️ Email Verification Pending</span>
            )}
            {user.ivsl_registration && (
              <div>🏛️ IVSL Reg: {user.ivsl_registration}</div>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'profile', label: '👤 Profile' },
          { id: 'credentials', label: '🎓 Credentials' },
          { id: 'reports', label: '📋 Reports' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '15px 25px',
              background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '3px solid #4ECDC4' : '3px solid transparent',
              fontWeight: activeTab === tab.id ? '600' : '400'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'overview' && (
          <div>
            <h2>📊 Dashboard Overview</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {[
                { title: '📊 Reports Created', value: '0', desc: 'Total valuation reports' },
                { title: '⏱️ This Month', value: '0', desc: 'Reports this month' },
                { title: '✅ Completed', value: '0', desc: 'Finalized reports' },
                { title: '📝 Draft', value: '0', desc: 'Work in progress' }
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '15px',
                    padding: '20px',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>{stat.title}</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ECDC4' }}>
                    {stat.value}
                  </div>
                  <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <h3>🕒 Recent Activity</h3>
              <p style={{ opacity: 0.8 }}>No recent activity</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2>👤 Professional Profile</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '25px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                padding: '25px'
              }}>
                <h3>Personal Information</h3>
                <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                  <div><strong>Full Name:</strong> {user.honorable && `${user.honorable} `}{user.full_name}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Professional Title:</strong> {user.professional_title || 'Not specified'}</div>
                  <div><strong>Professional Status:</strong> {user.professional_status || 'Not specified'}</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                padding: '25px'
              }}>
                <h3>Contact Information</h3>
                <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                  <div><strong>Address:</strong> {formatAddress(user)}</div>
                  <div><strong>Phone:</strong> {user.phone_number || 'Not provided'}</div>
                  <div><strong>Mobile:</strong> {user.mobile_number || 'Not provided'}</div>
                  <div><strong>Alternative Contact:</strong> {user.alternative_contact || 'Not provided'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'credentials' && (
          <div>
            <h2>🎓 Professional Credentials</h2>
            <div style={{
              display: 'grid',
              gap: '25px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                padding: '25px'
              }}>
                <h3>Professional Qualifications</h3>
                <p style={{ fontSize: '14px' }}>
                  {formatQualifications(user.qualifications)}
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                padding: '25px'
              }}>
                <h3>IVSL Registration</h3>
                <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                  <div><strong>Registration Number:</strong> {user.ivsl_registration || 'Not provided'}</div>
                  <div><strong>Membership Type:</strong> {user.ivsl_membership_type || 'Not specified'}</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                padding: '25px'
              }}>
                <h3>Professional Documents</h3>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>
                  Document upload functionality will be available in the next update.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2>📋 Valuation Reports</h2>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              padding: '25px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📝</div>
              <h3>No Reports Created Yet</h3>
              <p style={{ opacity: 0.8, marginBottom: '25px' }}>
                Start creating your first professional valuation report
              </p>
              <button
                style={{
                  padding: '15px 30px',
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ➕ Create New Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;