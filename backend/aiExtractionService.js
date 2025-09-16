const OpenAI = require('openai');

class AIExtractionService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Sri Lankan property document templates
    this.extractionPrompts = {
      deed_transfer: `
You are an expert at extracting key information from Sri Lankan property transfer deeds.
Extract the following information from the given text. Return ONLY valid JSON format.

Required fields:
- property_address: The full property address
- owner_name: Current property owner name
- previous_owner: Previous property owner (if mentioned)
- land_extent: Land extent/size (in perches, acres, etc.)
- survey_plan_number: Survey plan number
- deed_number: Deed registration number
- registration_date: Date of registration
- district_secretariat: District/Divisional Secretariat
- assessment_number: Assessment number (if mentioned)

Return format: {"property_address": "...", "owner_name": "...", "land_extent": "...", ...}
If information is not found, use "Not specified" as the value.

Text to analyze:
`,

      survey_plan: `
You are an expert at extracting information from Sri Lankan survey plans.
Extract the following information from the given text. Return ONLY valid JSON format.

Required fields:
- plan_number: Survey plan number
- survey_date: Date of survey
- surveyor_name: Licensed surveyor name
- property_boundaries: Description of property boundaries
- land_extent: Total land extent
- subdivisions: Any subdivisions mentioned
- coordinates: GPS coordinates or coordinate references

Return format: {"plan_number": "...", "survey_date": "...", "surveyor_name": "...", ...}
If information is not found, use "Not specified" as the value.

Text to analyze:
`,

      title_deed: `
You are an expert at extracting information from Sri Lankan title deeds and certificates.
Extract the following information from the given text. Return ONLY valid JSON format.

Required fields:
- certificate_number: Title certificate number
- property_address: Property address
- owner_name: Property owner name
- land_extent: Land extent
- nature_of_title: Nature of title (Freehold, Leasehold, etc.)
- encumbrances: Any encumbrances or restrictions
- issue_date: Certificate issue date

Return format: {"certificate_number": "...", "property_address": "...", "owner_name": "...", ...}
If information is not found, use "Not specified" as the value.

Text to analyze:
`,

      general_document: `
You are an expert at extracting property-related information from Sri Lankan documents.
Extract any relevant property information from the given text. Return ONLY valid JSON format.

Look for these fields when available:
- property_address: Any property address mentioned
- owner_name: Property owner name
- land_extent: Land size/extent
- document_type: Type of document this appears to be
- reference_numbers: Any reference or registration numbers
- dates: Important dates mentioned
- key_information: Any other important property details

Return format: {"property_address": "...", "owner_name": "...", "document_type": "...", ...}
If information is not found, use "Not specified" as the value.

Text to analyze:
`
    };
  }

  async extractPropertyData(extractedText, documentType) {
    try {
      console.log(`🤖 Starting AI data extraction for ${documentType} document...`);

      if (!extractedText || extractedText.trim().length < 10) {
        console.log('⚠️ Insufficient text for AI extraction');
        return {
          success: false,
          error: 'Insufficient text content for data extraction',
          extractedData: {}
        };
      }

      const prompt = this.extractionPrompts[documentType] || this.extractionPrompts.general_document;
      const fullPrompt = prompt + extractedText;

      console.log(`📝 Sending ${extractedText.length} characters to GPT-4 for analysis...`);

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert assistant specialized in extracting structured information from Sri Lankan property documents. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.1 // Low temperature for consistent, factual extraction
      });

      const aiResponse = response.choices[0].message.content;
      console.log('🤖 GPT-4 response received:', aiResponse);

      // Parse the JSON response
      let extractedData;
      try {
        extractedData = JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('❌ Failed to parse AI response as JSON:', parseError);
        // Try to clean the response and parse again
        const cleanedResponse = aiResponse.replace(/```json|```/g, '').trim();
        try {
          extractedData = JSON.parse(cleanedResponse);
        } catch (secondParseError) {
          throw new Error('AI response is not valid JSON: ' + aiResponse);
        }
      }

      console.log('✅ AI data extraction successful');
      return {
        success: true,
        extractedData: extractedData,
        confidence: this.calculateConfidence(extractedData),
        aiModel: 'gpt-4',
        processingDate: new Date().toISOString(),
        tokensUsed: response.usage.total_tokens
      };

    } catch (error) {
      console.error('❌ AI extraction error:', error);
      return {
        success: false,
        error: error.message,
        extractedData: {},
        confidence: 0
      };
    }
  }

  calculateConfidence(extractedData) {
    // Calculate confidence based on how many fields were successfully extracted
    const totalFields = Object.keys(extractedData).length;
    const filledFields = Object.values(extractedData).filter(value =>
      value && value !== "Not specified" && value !== ""
    ).length;

    if (totalFields === 0) return 0;
    return Math.round((filledFields / totalFields) * 100);
  }

  async batchExtractData(documents) {
    console.log(`🔄 Processing ${documents.length} documents for AI data extraction...`);
    const results = [];

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      console.log(`🤖 AI processing document ${i + 1}/${documents.length}: ${doc.fileName}`);

      try {
        const result = await this.extractPropertyData(
          doc.extractedText,
          doc.metadata?.documentType || 'general_document'
        );

        results.push({
          fileName: doc.fileName,
          documentType: doc.metadata?.documentType || 'general_document',
          ...result
        });

        // Delay to respect API rate limits
        if (i < documents.length - 1) {
          console.log('⏳ Waiting 2 seconds to respect API rate limits...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (error) {
        console.error(`❌ AI extraction failed for ${doc.fileName}:`, error);
        results.push({
          fileName: doc.fileName,
          documentType: doc.metadata?.documentType || 'general_document',
          success: false,
          error: error.message,
          extractedData: {},
          confidence: 0
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`✅ AI batch processing complete: ${successCount}/${results.length} successful`);

    return results;
  }

  // Method to combine and validate extracted data from multiple documents
  combineExtractedData(aiResults) {
    console.log('🔗 Combining data from multiple documents...');

    const combinedData = {};
    let highestConfidenceDoc = null;
    let highestConfidence = 0;

    // Find the document with highest confidence for primary data
    aiResults.forEach(result => {
      if (result.confidence > highestConfidence) {
        highestConfidence = result.confidence;
        highestConfidenceDoc = result;
      }
    });

    // Start with highest confidence document as base
    if (highestConfidenceDoc && highestConfidenceDoc.extractedData) {
      Object.assign(combinedData, highestConfidenceDoc.extractedData);
    }

    // Fill in missing data from other documents
    aiResults.forEach(result => {
      if (result.success && result.extractedData) {
        Object.keys(result.extractedData).forEach(key => {
          if (!combinedData[key] || combinedData[key] === "Not specified") {
            combinedData[key] = result.extractedData[key];
          }
        });
      }
    });

    return {
      combinedData: combinedData,
      sourceDocuments: aiResults.length,
      primarySource: highestConfidenceDoc?.fileName || 'Unknown',
      averageConfidence: Math.round(
        aiResults.reduce((sum, r) => sum + (r.confidence || 0), 0) / aiResults.length
      )
    };
  }

  async testConnection() {
    try {
      console.log('🧪 Testing OpenAI API connection...');

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: "Respond with exactly this JSON: {\"test\": \"success\", \"status\": \"connected\"}"
          }
        ],
        max_tokens: 50
      });

      const result = JSON.parse(response.choices[0].message.content);

      return {
        success: true,
        message: 'OpenAI API connection successful',
        model: 'gpt-4',
        testResult: result,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'OpenAI API connection failed',
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
const aiExtractionService = new AIExtractionService();
module.exports = aiExtractionService;