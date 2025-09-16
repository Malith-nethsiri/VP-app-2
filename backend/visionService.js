const vision = require('@google-cloud/vision');

class VisionService {
  constructor() {
    // Initialize Google Cloud Vision client
    // In production, you would set GOOGLE_APPLICATION_CREDENTIALS environment variable
    // pointing to your service account key file
    this.client = new vision.ImageAnnotatorClient({
      // For now, we'll handle credentials via environment variables
      keyFilename: process.env.GOOGLE_SERVICE_ACCOUNT_PATH,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    });
  }

  async extractTextFromBuffer(imageBuffer, mimeType) {
    try {
      console.log('🔍 Starting text extraction from document...');

      const request = {
        image: {
          content: imageBuffer.toString('base64')
        },
        features: [
          {
            type: 'DOCUMENT_TEXT_DETECTION',
            maxResults: 1
          }
        ]
      };

      const [result] = await this.client.annotateImage(request);
      const detections = result.textAnnotations;

      if (detections && detections.length > 0) {
        const extractedText = detections[0].description;
        console.log(`✅ Text extraction successful: ${extractedText.length} characters extracted`);

        return {
          success: true,
          extractedText: extractedText,
          confidence: detections[0].boundingPoly ? 0.9 : 0.7, // Rough confidence estimate
          metadata: {
            language: this.detectLanguage(extractedText),
            documentType: this.classifyDocument(extractedText),
            extractedAt: new Date().toISOString()
          }
        };
      } else {
        console.log('⚠️ No text found in document');
        return {
          success: false,
          error: 'No text detected in the document',
          extractedText: '',
          confidence: 0
        };
      }

    } catch (error) {
      console.error('❌ Vision API error:', error);
      return {
        success: false,
        error: error.message,
        extractedText: '',
        confidence: 0
      };
    }
  }

  async extractTextFromBase64(base64Data, mimeType) {
    try {
      // Remove data URL prefix if present
      const base64Clean = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64Clean, 'base64');

      return await this.extractTextFromBuffer(buffer, mimeType);
    } catch (error) {
      console.error('❌ Base64 processing error:', error);
      return {
        success: false,
        error: error.message,
        extractedText: '',
        confidence: 0
      };
    }
  }

  detectLanguage(text) {
    // Simple language detection based on character patterns
    if (/[\u0D80-\u0DFF]/.test(text)) {
      return 'si'; // Sinhala
    } else if (/[\u0B80-\u0BFF]/.test(text)) {
      return 'ta'; // Tamil
    } else {
      return 'en'; // Default to English
    }
  }

  classifyDocument(text) {
    const upperText = text.toUpperCase();

    // Document classification based on content patterns
    if (upperText.includes('DEED OF TRANSFER') || upperText.includes('TRANSFER DEED')) {
      return 'deed_transfer';
    } else if (upperText.includes('PLAN') && upperText.includes('SURVEY')) {
      return 'survey_plan';
    } else if (upperText.includes('TITLE') && (upperText.includes('DEED') || upperText.includes('CERTIFICATE'))) {
      return 'title_deed';
    } else if (upperText.includes('VALUATION') && upperText.includes('REPORT')) {
      return 'valuation_report';
    } else if (upperText.includes('ASSESSMENT') || upperText.includes('TAX')) {
      return 'assessment_notice';
    } else {
      return 'general_document';
    }
  }

  async batchExtractText(documents) {
    console.log(`🔄 Processing ${documents.length} documents in batch...`);
    const results = [];

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      console.log(`📄 Processing document ${i + 1}/${documents.length}: ${doc.name}`);

      try {
        const result = await this.extractTextFromBase64(doc.content, doc.type);
        results.push({
          fileName: doc.name,
          fileType: doc.type,
          fileSize: doc.size,
          ...result
        });

        // Small delay to avoid rate limiting
        if (i < documents.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`❌ Error processing ${doc.name}:`, error);
        results.push({
          fileName: doc.name,
          fileType: doc.type,
          fileSize: doc.size,
          success: false,
          error: error.message,
          extractedText: '',
          confidence: 0
        });
      }
    }

    console.log(`✅ Batch processing complete: ${results.filter(r => r.success).length}/${results.length} successful`);
    return results;
  }

  // Test method for API connectivity
  async testConnection() {
    try {
      // Create a simple test image (1x1 white pixel) in base64
      const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      const buffer = Buffer.from(testImageBase64, 'base64');

      const request = {
        image: { content: testImageBase64 },
        features: [{ type: 'LABEL_DETECTION', maxResults: 1 }]
      };

      await this.client.annotateImage(request);

      return {
        success: true,
        message: 'Google Vision API connection successful',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Google Vision API connection failed',
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
const visionService = new VisionService();
module.exports = visionService;