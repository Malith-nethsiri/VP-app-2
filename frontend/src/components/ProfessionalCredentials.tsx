import React, { useState, useRef } from 'react';
import './ProfessionalCredentials.css';

interface User {
  id: number;
  honorable?: string;
  full_name: string;
  professional_title?: string;
  qualifications?: string[];
  ivsl_registration?: string;
  professional_status?: string;
  ivsl_membership_type?: string;
  signature_path?: string;
  letterhead_path?: string;
  profile_picture_path?: string;
}

interface CredentialsProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const ProfessionalCredentials: React.FC<CredentialsProps> = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('profile');

  const signatureInputRef = useRef<HTMLInputElement>(null);
  const letterheadInputRef = useRef<HTMLInputElement>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  const [editableData, setEditableData] = useState({
    honorable: user.honorable || '',
    full_name: user.full_name || '',
    professional_title: user.professional_title || '',
    qualifications: user.qualifications || [],
    ivsl_registration: user.ivsl_registration || '',
    professional_status: user.professional_status || '',
    ivsl_membership_type: user.ivsl_membership_type || ''
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Options based on planning specifications
  const honorableOptions = ['Dr', 'Mr', 'Vir', 'Ms', 'Mrs'];
  const membershipTypes = ['Fellow Member', 'Graduate Member', 'Associate Member'];
  const qualificationOptions = [
    'B.Sc. (Hons.) Estate Management',
    'M.Sc. REM (UK)',
    'M.R.I.C.S.(UK)',
    'F.I.V.(Sri Lanka)',
    'F.P.C.S.(UK)',
    'B.Sc. Surveying Science',
    'Diploma in Valuation',
    'Other Professional Qualification'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQualificationChange = (qualification: string, checked: boolean) => {
    setEditableData(prev => ({
      ...prev,
      qualifications: checked
        ? [...prev.qualifications, qualification]
        : prev.qualifications.filter(q => q !== qualification)
    }));
  };

  const updateProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...editableData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('✅ Profile updated successfully');
        onUpdate(data.user);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (fileType: 'signature' | 'letterhead' | 'profile_picture', file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real implementation, you would upload to a file storage service
      // For now, we'll simulate with a mock path
      const mockFilePath = `/uploads/${user.id}/${fileType}/${Date.now()}_${file.name}`;

      const response = await fetch(`${API_BASE_URL}/api/auth/upload-files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          fileType: fileType,
          filePath: mockFilePath
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`✅ ${fileType.replace('_', ' ').toUpperCase()} uploaded successfully`);

        // Update user data with new file path
        const updatedUser = {
          ...user,
          [`${fileType}_path`]: mockFilePath
        };
        onUpdate(updatedUser);

        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to upload file');
      }
    } catch (err) {
      setError('Network error occurred during upload');
      console.error('File upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileUpload = (fileType: 'signature' | 'letterhead' | 'profile_picture') => {
    const refs = {
      signature: signatureInputRef,
      letterhead: letterheadInputRef,
      profile_picture: profilePictureInputRef
    };
    refs[fileType].current?.click();
  };

  return (
    <div className="credentials-container">
      <div className="credentials-header">
        <h2>🎓 Professional Credentials Management</h2>
        <p>Manage your professional information and upload required documents</p>
      </div>

      {error && (
        <div className="message error-message">
          <span className="message-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="message success-message">
          <span className="message-icon">✅</span>
          {success}
        </div>
      )}

      {/* Section Navigation */}
      <div className="credentials-tabs">
        <button
          className={`tab-button ${activeSection === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          👤 Professional Profile
        </button>
        <button
          className={`tab-button ${activeSection === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveSection('documents')}
        >
          📄 Professional Documents
        </button>
        <button
          className={`tab-button ${activeSection === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveSection('verification')}
        >
          ✅ Verification Status
        </button>
      </div>

      {/* Professional Profile Section */}
      {activeSection === 'profile' && (
        <div className="credentials-section">
          <h3>👤 Professional Profile Information</h3>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="honorable">Title</label>
              <select
                id="honorable"
                name="honorable"
                value={editableData.honorable}
                onChange={handleInputChange}
              >
                <option value="">Select Title</option>
                {honorableOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="full_name">Full Name *</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={editableData.full_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="professional_title">Professional Title</label>
              <input
                type="text"
                id="professional_title"
                name="professional_title"
                value={editableData.professional_title}
                onChange={handleInputChange}
                placeholder="e.g., Chartered Valuation Surveyor"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ivsl_registration">IVSL Registration Number</label>
              <input
                type="text"
                id="ivsl_registration"
                name="ivsl_registration"
                value={editableData.ivsl_registration}
                onChange={handleInputChange}
                placeholder="Enter IVSL registration number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ivsl_membership_type">IVSL Membership Type</label>
              <select
                id="ivsl_membership_type"
                name="ivsl_membership_type"
                value={editableData.ivsl_membership_type}
                onChange={handleInputChange}
              >
                <option value="">Select Membership Type</option>
                {membershipTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="professional_status">Professional Status</label>
              <input
                type="text"
                id="professional_status"
                name="professional_status"
                value={editableData.professional_status}
                onChange={handleInputChange}
                placeholder="e.g., Rtd. Govt. Chief Valuer, Private Practice"
              />
            </div>

            <div className="form-group full-width">
              <label>Professional Qualifications</label>
              <div className="qualifications-grid">
                {qualificationOptions.map(qualification => (
                  <label key={qualification} className="qualification-item">
                    <input
                      type="checkbox"
                      checked={editableData.qualifications.includes(qualification)}
                      onChange={(e) => handleQualificationChange(qualification, e.target.checked)}
                    />
                    <span>{qualification}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              onClick={updateProfile}
              disabled={loading}
              className="update-button"
            >
              {loading ? '⏳ Updating...' : '💾 Update Profile'}
            </button>
          </div>
        </div>
      )}

      {/* Professional Documents Section */}
      {activeSection === 'documents' && (
        <div className="credentials-section">
          <h3>📄 Professional Documents</h3>
          <p className="section-description">
            Upload your professional documents for report generation and verification
          </p>

          <div className="documents-grid">
            {/* Digital Signature */}
            <div className="document-card">
              <div className="document-header">
                <h4>✍️ Digital Signature</h4>
                <span className={`status ${user.signature_path ? 'uploaded' : 'missing'}`}>
                  {user.signature_path ? '✅ Uploaded' : '❌ Not uploaded'}
                </span>
              </div>
              <p>Upload your digital signature for inclusion in valuation reports</p>
              <div className="document-actions">
                <button
                  onClick={() => triggerFileUpload('signature')}
                  disabled={loading}
                  className="upload-button"
                >
                  📤 {user.signature_path ? 'Replace' : 'Upload'} Signature
                </button>
                {user.signature_path && (
                  <button className="view-button">👁️ View Current</button>
                )}
              </div>
              <input
                ref={signatureInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('signature', file);
                }}
              />
            </div>

            {/* Letterhead Template */}
            <div className="document-card">
              <div className="document-header">
                <h4>📋 Letterhead Template</h4>
                <span className={`status ${user.letterhead_path ? 'uploaded' : 'missing'}`}>
                  {user.letterhead_path ? '✅ Uploaded' : '❌ Not uploaded'}
                </span>
              </div>
              <p>Upload your official letterhead template for report headers</p>
              <div className="document-actions">
                <button
                  onClick={() => triggerFileUpload('letterhead')}
                  disabled={loading}
                  className="upload-button"
                >
                  📤 {user.letterhead_path ? 'Replace' : 'Upload'} Letterhead
                </button>
                {user.letterhead_path && (
                  <button className="view-button">👁️ View Current</button>
                )}
              </div>
              <input
                ref={letterheadInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('letterhead', file);
                }}
              />
            </div>

            {/* Profile Picture */}
            <div className="document-card">
              <div className="document-header">
                <h4>👤 Profile Picture</h4>
                <span className={`status ${user.profile_picture_path ? 'uploaded' : 'missing'}`}>
                  {user.profile_picture_path ? '✅ Uploaded' : '❌ Not uploaded'}
                </span>
              </div>
              <p>Upload a professional profile picture for your dashboard</p>
              <div className="document-actions">
                <button
                  onClick={() => triggerFileUpload('profile_picture')}
                  disabled={loading}
                  className="upload-button"
                >
                  📤 {user.profile_picture_path ? 'Replace' : 'Upload'} Picture
                </button>
                {user.profile_picture_path && (
                  <button className="view-button">👁️ View Current</button>
                )}
              </div>
              <input
                ref={profilePictureInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('profile_picture', file);
                }}
              />
            </div>
          </div>

          <div className="upload-guidelines">
            <h4>📋 Upload Guidelines</h4>
            <ul>
              <li>Supported formats: JPEG, PNG, GIF</li>
              <li>Maximum file size: 5MB</li>
              <li>Recommended resolution: 300 DPI for print quality</li>
              <li>Signature should be on a transparent or white background</li>
              <li>Letterhead should match your official stationery</li>
            </ul>
          </div>
        </div>
      )}

      {/* Verification Status Section */}
      {activeSection === 'verification' && (
        <div className="credentials-section">
          <h3>✅ Verification Status</h3>
          <p className="section-description">
            Track the verification status of your professional credentials
          </p>

          <div className="verification-grid">
            <div className="verification-item">
              <div className="verification-header">
                <h4>📧 Email Verification</h4>
                <span className={`verification-badge ${user ? 'verified' : 'pending'}`}>
                  {user ? '✅ Verified' : '⏳ Pending'}
                </span>
              </div>
              <p>Your email address has been verified and is active.</p>
            </div>

            <div className="verification-item">
              <div className="verification-header">
                <h4>🏛️ IVSL Registration</h4>
                <span className={`verification-badge ${user.ivsl_registration ? 'verified' : 'pending'}`}>
                  {user.ivsl_registration ? '✅ Provided' : '⏳ Not provided'}
                </span>
              </div>
              <p>
                {user.ivsl_registration
                  ? `Registration: ${user.ivsl_registration}`
                  : 'Please provide your IVSL registration number'
                }
              </p>
            </div>

            <div className="verification-item">
              <div className="verification-header">
                <h4>📄 Document Completeness</h4>
                <span className={`verification-badge ${
                  user.signature_path && user.letterhead_path ? 'verified' : 'partial'
                }`}>
                  {user.signature_path && user.letterhead_path ? '✅ Complete' : '⚠️ Incomplete'}
                </span>
              </div>
              <p>
                {user.signature_path && user.letterhead_path
                  ? 'All required documents have been uploaded'
                  : 'Please upload your signature and letterhead'
                }
              </p>
            </div>

            <div className="verification-item">
              <div className="verification-header">
                <h4>🎓 Professional Status</h4>
                <span className={`verification-badge ${user.professional_title ? 'verified' : 'pending'}`}>
                  {user.professional_title ? '✅ Complete' : '⏳ Incomplete'}
                </span>
              </div>
              <p>
                {user.professional_title
                  ? `Status: ${user.professional_title}`
                  : 'Please complete your professional information'
                }
              </p>
            </div>
          </div>

          <div className="verification-summary">
            <h4>📊 Profile Completion</h4>
            <div className="completion-bar">
              <div
                className="completion-fill"
                style={{
                  width: `${
                    [user.ivsl_registration, user.signature_path, user.letterhead_path, user.professional_title]
                      .filter(Boolean).length * 25
                  }%`
                }}
              ></div>
            </div>
            <p>
              {[user.ivsl_registration, user.signature_path, user.letterhead_path, user.professional_title]
                .filter(Boolean).length} of 4 verification criteria completed
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalCredentials;