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
      'POST /api/db/migrate - Migrate database to enhanced schema',
      'POST /api/auth/register - Enhanced user registration with IVSL fields',
      'POST /api/auth/verify-email - Email verification',
      'GET /api/auth/profile - Get user profile',
      'PUT /api/auth/profile - Update user profile',
      'POST /api/auth/upload-files - Upload signature/letterhead/profile picture',
      'POST /api/ai/test - AI service testing',
      'POST /api/vision/test - Google Vision API testing',
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

// Database migration endpoint for enhanced user fields
app.post('/api/db/migrate', async (req, res) => {
  try {
    const { migrateDatabase } = require('./migrate-database');
    await migrateDatabase();
    res.json({
      success: true,
      message: '✅ Database migration completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database migration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to migrate database schema',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced user registration endpoint with IVSL professional fields
app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      email, password,
      // Personal Details (based on planning/document-analysis.md lines 14-22)
      honorable, full_name, professional_title, qualifications,
      // Professional Registration (lines 23-27)
      ivsl_registration, professional_status, ivsl_membership_type,
      // Contact Information (lines 28-35)
      house_number, street_name, area_name, city, district,
      phone_number, mobile_number, alternative_contact
    } = req.body;

    // Basic validation
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required'
      });
    }

    // Validate IVSL registration if provided
    if (ivsl_registration && ivsl_registration.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'IVSL registration number must be at least 3 characters'
      });
    }

    // Validate honorable values
    const validHonorables = ['Dr', 'Mr', 'Vlr', 'Ms', 'Mrs'];
    if (honorable && !validHonorables.includes(honorable)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid title. Must be one of: Dr, Mr, Vlr, Ms, Mrs'
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

    // Generate email verification token
    const crypto = require('crypto');
    const email_verification_token = crypto.randomBytes(32).toString('hex');

    // Create user with all professional fields
    const newUser = await db.createUser({
      email, password_hash, honorable, full_name, professional_title,
      qualifications: qualifications || [],
      ivsl_registration, professional_status, ivsl_membership_type,
      house_number, street_name, area_name, city, district,
      phone_number, mobile_number, alternative_contact,
      email_verification_token
    });

    res.status(201).json({
      success: true,
      message: '✅ User registered successfully. Please check your email for verification.',
      user: {
        id: newUser.id,
        email: newUser.email,
        honorable: newUser.honorable,
        full_name: newUser.full_name,
        professional_title: newUser.professional_title,
        ivsl_registration: newUser.ivsl_registration,
        created_at: newUser.created_at
      },
      verification_required: true,
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

// Email verification endpoint
app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({
        success: false,
        error: 'Email and verification token are required'
      });
    }

    const verifiedUser = await db.verifyUserEmail(email, token);
    if (!verifiedUser) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification token or email'
      });
    }

    res.json({
      success: true,
      message: '✅ Email verified successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify email',
      details: error.message
    });
  }
});

// Get user profile endpoint
app.get('/api/auth/profile', async (req, res) => {
  try {
    // Note: This would normally require authentication middleware
    const { userId, email } = req.query;

    let user;
    if (userId) {
      user = await db.getUserById(userId);
    } else if (email) {
      user = await db.getUserByEmail(email);
    } else {
      return res.status(400).json({
        success: false,
        error: 'User ID or email is required'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove sensitive information
    const { password_hash, email_verification_token, ...userProfile } = user;

    res.json({
      success: true,
      user: userProfile,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      details: error.message
    });
  }
});

// Update user profile endpoint (PUT method)
app.put('/api/auth/profile', async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const updatedUser = await db.updateUserProfile(userId, profileData);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove sensitive information
    const { password_hash, email_verification_token, ...userProfile } = updatedUser;

    res.json({
      success: true,
      message: '✅ Profile updated successfully',
      user: userProfile,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      details: error.message
    });
  }
});

// Update user profile endpoint (POST method for frontend compatibility)
app.post('/api/auth/update-profile', async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Validate honorable values if provided
    if (profileData.honorable) {
      const validHonorables = ['Dr', 'Mr', 'Vlr', 'Ms', 'Mrs'];
      if (!validHonorables.includes(profileData.honorable)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid title. Must be one of: Dr, Mr, Vlr, Ms, Mrs'
        });
      }
    }

    // Validate IVSL membership type if provided
    if (profileData.ivsl_membership_type) {
      const validMemberships = ['Fellow', 'Member', 'Associate', 'Student'];
      if (!validMemberships.includes(profileData.ivsl_membership_type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid IVSL membership type'
        });
      }
    }

    // Validate professional status if provided
    if (profileData.professional_status) {
      const validStatuses = ['Licensed Valuer', 'Provisional Valuer', 'Trainee Valuer', 'Consulting Valuer'];
      if (!validStatuses.includes(profileData.professional_status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid professional status'
        });
      }
    }

    const updatedUser = await db.updateUserProfile(userId, profileData);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove sensitive information
    const { password_hash, email_verification_token, ...userProfile } = updatedUser;

    res.json({
      success: true,
      message: '✅ Profile updated successfully',
      user: userProfile,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      details: error.message
    });
  }
});

// Create new valuation report
app.post('/api/reports/create', async (req, res) => {
  try {
    const { valuer_id, report_reference, client_reference, property_address, gps_coordinates } = req.body;

    if (!valuer_id || !report_reference) {
      return res.status(400).json({
        success: false,
        error: 'Valuer ID and report reference are required'
      });
    }

    // Check if report reference is unique
    const existingReport = await db.query('SELECT id FROM valuation_reports WHERE report_reference = $1', [report_reference]);
    if (existingReport.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Report reference already exists. Please use a unique reference.'
      });
    }

    const newReport = await db.createReport({
      valuer_id,
      report_reference,
      client_reference,
      property_address,
      gps_coordinates
    });

    res.status(201).json({
      success: true,
      message: '✅ Report created successfully',
      report: newReport,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Report creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create report',
      details: error.message
    });
  }
});

// Get reports for a user
app.get('/api/reports/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const reports = await db.getReportsByUser(userId);

    res.json({
      success: true,
      reports: reports,
      count: reports.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Fetch reports error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports',
      details: error.message
    });
  }
});

// Document upload endpoint with AI processing
app.post('/api/documents/upload', async (req, res) => {
  try {
    const { report_id, files } = req.body;

    if (!report_id || !files || !Array.isArray(files)) {
      return res.status(400).json({
        success: false,
        error: 'Report ID and files array are required'
      });
    }

    const uploadedDocs = [];

    for (let fileData of files) {
      // Here we would:
      // 1. Store file to cloud storage (AWS S3, Google Cloud, etc.)
      // 2. Extract text using Google Vision API
      // 3. Process with OpenAI GPT-4 for data extraction
      // 4. Save to database

      // For now, simulate the process
      const docRecord = {
        report_id: report_id,
        file_name: fileData.name,
        file_path: `/uploads/${report_id}/${fileData.name}`, // Simulated path
        file_type: fileData.type,
        file_size: fileData.size,
        extracted_data: {
          // Simulated extracted data - will be replaced with real AI processing
          status: 'processed',
          document_type: fileData.type.includes('pdf') ? 'deed_transfer' : 'photograph',
          extracted_text: 'Sample extracted text from document...',
          key_data: {
            property_id: 'Extracted property identification',
            owner_name: 'Extracted owner name',
            land_extent: 'Extracted land extent'
          }
        }
      };

      // Save to database
      const savedDoc = await db.saveDocument(docRecord);
      uploadedDocs.push(savedDoc);
    }

    res.json({
      success: true,
      message: `✅ ${uploadedDocs.length} documents uploaded and processed`,
      documents: uploadedDocs,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload documents',
      details: error.message
    });
  }
});

// File upload endpoint for signatures, letterheads, and profile pictures
app.post('/api/auth/upload-files', async (req, res) => {
  try {
    // Note: This is a basic implementation. In production, you'd use multer or similar
    const { userId, fileType, filePath } = req.body;

    if (!userId || !fileType || !filePath) {
      return res.status(400).json({
        success: false,
        error: 'User ID, file type, and file path are required'
      });
    }

    const validFileTypes = ['signature', 'letterhead', 'profile_picture'];
    if (!validFileTypes.includes(fileType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type. Must be: signature, letterhead, or profile_picture'
      });
    }

    const fileData = {};
    fileData[`${fileType}_path`] = filePath;

    const updatedUser = await db.updateUserFiles(userId, fileData);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `✅ ${fileType} uploaded successfully`,
      filePath: filePath,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
      details: error.message
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