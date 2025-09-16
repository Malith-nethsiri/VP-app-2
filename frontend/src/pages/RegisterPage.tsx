import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegistrationData {
  // Account Info
  email: string;
  password: string;
  confirmPassword: string;

  // Personal Details (DEVELOPMENT_TASK_PLAN.md lines 37-41)
  honorable: string;
  full_name: string;
  professional_title: string;
  qualifications: string[];

  // Professional Registration (lines 43-46)
  ivsl_registration: string;
  professional_status: string;
  ivsl_membership_type: string;

  // Contact Information (lines 48-52)
  house_number: string;
  street_name: string;
  area_name: string;
  city: string;
  district: string;
  phone_number: string;
  mobile_number: string;
  alternative_contact: string;
}

const RegisterPage: React.FC = () => {
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

  // Options from DEVELOPMENT_TASK_PLAN.md specifications
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
        // Contact validation - optional but validate format if provided
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-page">
        <div className="form-container">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
            <h2>Registration Successful!</h2>
            <p>
              Your account has been created successfully. Please check your email
              for verification instructions before logging in.
            </p>
            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                className="form-button"
                onClick={() => navigate('/login')}
                style={{ width: 'auto', padding: '10px 20px' }}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-container" style={{ maxWidth: '600px' }}>
        <h1 className="form-title">🏠 Professional Valuer Registration</h1>

        {/* Progress Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          gap: '20px'
        }}>
          {[1, 2, 3].map(step => (
            <div
              key={step}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: currentStep >= step ? '#4ECDC4' : '#e0e0e0',
                color: currentStep >= step ? 'white' : '#999',
                fontWeight: 'bold'
              }}
            >
              {step}
            </div>
          ))}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Step 1: Account Information */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>📧 Account Information</h3>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
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
          <div>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>🎓 Professional Information</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <select
                  name="honorable"
                  className="form-input"
                  value={formData.honorable}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {honorableOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  className="form-input"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Title</label>
              <input
                type="text"
                name="professional_title"
                className="form-input"
                value={formData.professional_title}
                onChange={handleInputChange}
                placeholder="e.g., Chartered Valuation Surveyor"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Professional Qualifications</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '8px',
                marginTop: '8px'
              }}>
                {qualificationOptions.map(qualification => (
                  <label
                    key={qualification}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.qualifications.includes(qualification)}
                      onChange={(e) => handleQualificationChange(qualification, e.target.checked)}
                    />
                    {qualification}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">IVSL Registration</label>
                <input
                  type="text"
                  name="ivsl_registration"
                  className="form-input"
                  value={formData.ivsl_registration}
                  onChange={handleInputChange}
                  placeholder="IVSL registration number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Membership Type</label>
                <select
                  name="ivsl_membership_type"
                  className="form-input"
                  value={formData.ivsl_membership_type}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {membershipTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Status</label>
              <input
                type="text"
                name="professional_status"
                className="form-input"
                value={formData.professional_status}
                onChange={handleInputChange}
                placeholder="e.g., Rtd. Govt. Chief Valuer, Private Practice"
              />
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>📍 Contact Information</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">House Number</label>
                <input
                  type="text"
                  name="house_number"
                  className="form-input"
                  value={formData.house_number}
                  onChange={handleInputChange}
                  placeholder="House/Building number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Street Name</label>
                <input
                  type="text"
                  name="street_name"
                  className="form-input"
                  value={formData.street_name}
                  onChange={handleInputChange}
                  placeholder="Street or road name"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Area/Village</label>
                <input
                  type="text"
                  name="area_name"
                  className="form-input"
                  value={formData.area_name}
                  onChange={handleInputChange}
                  placeholder="Area or village"
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  name="district"
                  className="form-input"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="District name"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  className="form-input"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="+94 11 234 5678"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile_number"
                  className="form-input"
                  value={formData.mobile_number}
                  onChange={handleInputChange}
                  placeholder="+94 77 123 4567"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alternative Contact</label>
              <input
                type="text"
                name="alternative_contact"
                className="form-input"
                value={formData.alternative_contact}
                onChange={handleInputChange}
                placeholder="Alternative contact method"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '30px'
        }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              style={{
                background: 'none',
                border: '2px solid #4ECDC4',
                color: '#4ECDC4',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
              disabled={loading}
            >
              ← Previous
            </button>
          ) : <div></div>}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="form-button"
              style={{ width: 'auto', padding: '10px 30px' }}
              disabled={loading}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="form-button"
              style={{ width: 'auto', padding: '10px 30px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : '✅ Create Account'}
            </button>
          )}
        </div>

        <div className="form-link">
          Already have an account? <a href="/login">Sign in here</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;