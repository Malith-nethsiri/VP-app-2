import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  version: string;
}

interface ApiResponse {
  message: string;
  timestamp: string;
  endpoints: string[];
}

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [aiTest, setAiTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test backend connectivity on component mount
  useEffect(() => {
    testBackendConnectivity();
  }, []);

  const testBackendConnectivity = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test health endpoint
      const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
      if (!healthResponse.ok) {
        throw new Error(`Health check failed: ${healthResponse.status}`);
      }
      const healthData = await healthResponse.json();
      setHealthStatus(healthData);

      // Test API endpoint
      const apiResponse = await fetch(`${API_BASE_URL}/api/test`);
      if (!apiResponse.ok) {
        throw new Error(`API test failed: ${apiResponse.status}`);
      }
      const apiData = await apiResponse.json();
      setApiResponse(apiData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Backend connectivity test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const testAIService = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true })
      });

      if (!response.ok) {
        throw new Error(`AI test failed: ${response.status}`);
      }

      const data = await response.json();
      setAiTest(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI test failed');
      console.error('AI service test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏠 AI-Powered Valuation System</h1>
        <p>Professional Property Valuation Reports with AI Technology</p>

        <div className="status-section">
          <h2>🔧 System Status</h2>

          {loading && <div className="loading">⏳ Testing connectivity...</div>}
          {error && <div className="error">❌ Error: {error}</div>}

          {/* Backend Health Status */}
          {healthStatus && (
            <div className="status-card healthy">
              <h3>✅ Backend Status</h3>
              <p><strong>Status:</strong> {healthStatus.status}</p>
              <p><strong>Message:</strong> {healthStatus.message}</p>
              <p><strong>Version:</strong> {healthStatus.version}</p>
              <p><strong>Timestamp:</strong> {new Date(healthStatus.timestamp).toLocaleString()}</p>
            </div>
          )}

          {/* API Response */}
          {apiResponse && (
            <div className="status-card healthy">
              <h3>🔗 API Connectivity</h3>
              <p><strong>Message:</strong> {apiResponse.message}</p>
              <p><strong>Available Endpoints:</strong></p>
              <ul className="endpoint-list">
                {apiResponse.endpoints.map((endpoint, index) => (
                  <li key={index}>{endpoint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Test Results */}
          {aiTest && (
            <div className="status-card healthy">
              <h3>🤖 AI Service Test</h3>
              <p><strong>Status:</strong> {aiTest.success ? '✅ Working' : '❌ Failed'}</p>
              <p><strong>Message:</strong> {aiTest.message}</p>
              {aiTest.aiResponse && (
                <p><strong>AI Response:</strong> {aiTest.aiResponse}</p>
              )}
              <p><strong>Timestamp:</strong> {new Date(aiTest.timestamp).toLocaleString()}</p>
            </div>
          )}

          <div className="action-buttons">
            <button onClick={testBackendConnectivity} disabled={loading}>
              🔄 Refresh Status
            </button>
            <button onClick={testAIService} disabled={loading}>
              🤖 Test AI Services
            </button>
          </div>
        </div>

        <div className="info-section">
          <h2>📋 Deployment Information</h2>
          <div className="deployment-info">
            <p><strong>Frontend:</strong> Deployed on Vercel</p>
            <p><strong>Backend:</strong> Deployed on Railway</p>
            <p><strong>API URL:</strong> {API_BASE_URL}</p>
            <p><strong>Build Time:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>

        <div className="next-steps">
          <h2>🚀 System Features</h2>
          <ol>
            <li>✅ Backend deployed and running</li>
            <li>✅ Frontend deployed and running</li>
            <li>✅ API connectivity established</li>
            <li>✅ Enhanced user authentication with IVSL fields</li>
            <li>✅ Professional dashboard system</li>
            <li>✅ Database with PostgreSQL</li>
            <li>🔄 AI services integration</li>
            <li>⏳ Document upload functionality</li>
            <li>⏳ Report generation system</li>
          </ol>
        </div>

        <div className="demo-section">
          <h2>🎯 Professional Valuer System Demo</h2>
          <div className="demo-buttons">
            <button
              onClick={() => window.location.href = '/register'}
              className="demo-button primary"
            >
              👤 Professional Registration Demo
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="demo-button secondary"
            >
              📊 Valuer Dashboard Demo
            </button>
            <button
              onClick={() => window.location.href = '/credentials'}
              className="demo-button secondary"
            >
              🎓 Credentials Management Demo
            </button>
          </div>
          <p className="demo-note">
            <strong>Note:</strong> These are demo components showing the enhanced IVSL-compliant
            professional valuer registration and management system implemented in Task 1.
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;