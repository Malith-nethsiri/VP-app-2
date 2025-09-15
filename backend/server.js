require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./database');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - allow frontend to connect
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint with database status
app.get('/api/health', async (req, res) => {
  try {
    const dbHealth = await db.healthCheck();

    res.json({
      status: dbHealth.connected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      message: '🏠 AI Valuation App Backend is running!',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbHealth.status,
        connected: dbHealth.connected,
        timestamp: dbHealth.timestamp
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      message: 'Backend running but database unavailable',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'error',
        connected: false,
        error: error.message
      }
    });
  }
});

// Test endpoint to verify API connectivity
app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ Backend API is working!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/health - Health check with database status',
      'GET /api/test - Test connectivity',
      'POST /api/db/init - Initialize database schema',
      'POST /api/auth/register - User registration',
      'POST /api/ai/test - AI service testing',
      'POST /api/documents/upload - Document upload (coming soon)'
    ]
  });
});

// Database initialization endpoint
app.post('/api/db/init', async (req, res) => {
  try {
    await db.initializeSchema();
    res.json({
      success: true,
      message: '✅ Database schema initialized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize database schema',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, professional_title, ivsl_registration } = req.body;

    // Basic validation
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required'
      });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await db.createUser({
      email,
      password_hash,
      full_name,
      professional_title,
      ivsl_registration
    });

    res.status(201).json({
      success: true,
      message: '✅ User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        created_at: newUser.created_at
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// AI test endpoint (basic)
app.post('/api/ai/test', async (req, res) => {
  try {
    const { OpenAI } = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional property valuer. Respond with a brief test message."
        },
        {
          role: "user",
          content: "Please confirm that the AI service is working properly."
        }
      ],
      max_tokens: 100
    });

    res.json({
      success: true,
      message: 'OpenAI API is working!',
      aiResponse: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      error: 'AI service temporarily unavailable',
      details: error.message
    });
  }
});

// Google Vision API test endpoint
app.post('/api/vision/test', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Google Vision API endpoint ready',
      note: 'Full OCR functionality will be implemented next',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Vision API error',
      details: error.message
    });
  }
});

// Catch all route
app.get('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'Please check the API documentation for valid endpoints',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Important for Railway deployment

app.listen(PORT, HOST, () => {
  console.log(`
🚀 VP App Backend Server Started Successfully!
📍 Server running on: http://${HOST}:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 Health check: http://${HOST}:${PORT}/api/health
🧪 Test endpoint: http://${HOST}:${PORT}/api/test
⏰ Started at: ${new Date().toISOString()}
  `);
});