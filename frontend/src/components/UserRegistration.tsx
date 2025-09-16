import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserRegistration.css';

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  // Personal Details (based on planning/document-analysis.md lines 14-22)
  honorable: string;
  full_name: string;
  professional_title: string;
  qualifications: string[];
  // Professional Registration (lines 23-27)
  ivsl_registration: string;
  professional_status: string;
  ivsl_membership_type: string;
  // Contact Information (lines 28-35)
  house_number: string;
  street_name: string;
  area_name: string;
  city: string;
  district: string;
  phone_number: string;
  mobile_number: string;
  alternative_contact: string;
}

const UserRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    honorable: '',
    full_name: '',
    professional_title: '',
    qualifications: [],
    ivsl_registration: '',
    professional_status: '',
    ivsl_membership_type: '',
    house_number: '',
    street_name: '',
    area_name: '',
    city: '',
    district: '',
    phone_number: '',
    mobile_number: '',
    alternative_contact: ''
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Dropdown options based on planning specifications
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleQualificationChange = (qualification: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      qualifications: checked
        ? [...prev.qualifications, qualification]
        : prev.qualifications.filter(q => q !== qualification)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all required fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
        break;
      case 2:
        if (!formData.full_name) {
          setError('Full name is required');
          return false;
        }
        break;
      case 3:
        // Contact information is optional but validate format if provided
        if (formData.phone_number && !/^[0-9+\-\s()]+$/.test(formData.phone_number)) {
          setError('Please enter a valid phone number');
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          qualifications: formData.qualifications
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="registration-container">
        <div className="registration-card">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Registration Successful!</h2>
            <p>
              Your account has been created successfully. Please check your email
              for verification instructions before logging in.
            </p>
            <div className="success-actions">
              <button
                className="verify-button primary"
                onClick={() => navigate('/verify-email')}
              >
                📧 Verify Email Now
              </button>
              <button
                className="login-button secondary"
                onClick={() => navigate('/login')}
              >
                Skip to Login
              </button>
            </div>
            <div className="success-note">
              <p>
                <strong>Note:</strong> Email verification is required for full access
                to the professional valuation system features.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <h1>🏠 Professional Valuer Registration</h1>
          <p>Join the AI-Powered Valuation System</p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Account</span>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Professional</span>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Contact</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form className="registration-form">
          {/* Step 1: Basic Account Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>📧 Account Information</h3>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>🎓 Professional Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="honorable">Title</label>
                  <select
                    id="honorable"
                    name="honorable"
                    value={formData.honorable}
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
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="professional_title">Professional Title</label>
                <input
                  type="text"
                  id="professional_title"
                  name="professional_title"
                  value={formData.professional_title}
                  onChange={handleInputChange}
                  placeholder="e.g., Chartered Valuation Surveyor"
                />
              </div>

              <div className="form-group">
                <label>Professional Qualifications</label>
                <div className="qualifications-grid">
                  {qualificationOptions.map(qualification => (
                    <label key={qualification} className="qualification-item">
                      <input
                        type="checkbox"
                        checked={formData.qualifications.includes(qualification)}
                        onChange={(e) => handleQualificationChange(qualification, e.target.checked)}
                      />
                      <span>{qualification}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ivsl_registration">IVSL Registration Number</label>
                  <input
                    type="text"
                    id="ivsl_registration"
                    name="ivsl_registration"
                    value={formData.ivsl_registration}
                    onChange={handleInputChange}
                    placeholder="Enter IVSL registration number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ivsl_membership_type">IVSL Membership Type</label>
                  <select
                    id="ivsl_membership_type"
                    name="ivsl_membership_type"
                    value={formData.ivsl_membership_type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Membership Type</option>
                    {membershipTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="professional_status">Professional Status</label>
                <input
                  type="text"
                  id="professional_status"
                  name="professional_status"
                  value={formData.professional_status}
                  onChange={handleInputChange}
                  placeholder="e.g., Rtd. Govt. Chief Valuer, Private Practice"
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>📍 Contact Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="house_number">House Number</label>
                  <input
                    type="text"
                    id="house_number"
                    name="house_number"
                    value={formData.house_number}
                    onChange={handleInputChange}
                    placeholder="House/Building number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="street_name">Street Name</label>
                  <input
                    type="text"
                    id="street_name"
                    name="street_name"
                    value={formData.street_name}
                    onChange={handleInputChange}
                    placeholder="Street or road name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="area_name">Area/Village</label>
                  <input
                    type="text"
                    id="area_name"
                    name="area_name"
                    value={formData.area_name}
                    onChange={handleInputChange}
                    placeholder="Area or village name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="district">District</label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="District name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone_number">Phone Number</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="+94 11 234 5678"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mobile_number">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile_number"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="alternative_contact">Alternative Contact</label>
                <input
                  type="text"
                  id="alternative_contact"
                  name="alternative_contact"
                  value={formData.alternative_contact}
                  onChange={handleInputChange}
                  placeholder="Alternative phone or contact method"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="nav-button secondary"
                disabled={loading}
              >
                ← Previous
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="nav-button primary"
                disabled={loading}
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="nav-button primary submit"
                disabled={loading}
              >
                {loading ? '⏳ Creating Account...' : '✅ Create Account'}
              </button>
            )}
          </div>
        </form>

        <div className="registration-footer">
          <p>
            Already have an account?
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="login-link"
            >
              Sign in here
            </button>
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="home-link"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;