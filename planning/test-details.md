# Comprehensive Testing & Debugging Guide for AI-Powered Valuation Webapp

## Overview
This document outlines advanced testing and debugging methodologies specifically designed for AI-powered web applications in 2025, with focus on terminal/console-based tools and modern automation strategies.

## Table of Contents
1. [AI-Powered Testing Strategies](#ai-powered-testing-strategies)
2. [Terminal & Console Debugging Workflows](#terminal--console-debugging-workflows)
3. [Performance Monitoring & AI Model Validation](#performance-monitoring--ai-model-validation)
4. [Command-Line Testing Tools Integration](#command-line-testing-tools-integration)
5. [Testing Framework Architecture](#testing-framework-architecture)
6. [AI Service Testing Strategies](#ai-service-testing-strategies)
7. [Debugging Methodologies](#debugging-methodologies)
8. [Production Monitoring & Alerting](#production-monitoring--alerting)

---

## AI-Powered Testing Strategies

### 1. KaneAI Integration (LambdaTest)
**GenAI Native QA Agent-as-a-Service Platform**

```bash
# Terminal setup for KaneAI integration
npm install -g @lambdatest/kaneai-cli
kane-ai init --project valuation-app
kane-ai generate-tests --natural-language "Test document upload with AI OCR processing"
```

**Key Features:**
- Natural language test generation
- Automated test case refinement
- Cross-browser compatibility validation
- AI-powered regression detection

**Implementation for Valuation App:**
```javascript
// AI-generated test example
describe('Document Processing Workflow', () => {
  it('should process PDF documents with OCR and extract valuation data', async () => {
    // KaneAI will generate this test from natural language
    await kane.uploadDocument('sample-valuation.pdf');
    await kane.waitForAIProcessing();
    await kane.validateExtractedData({
      propertyAddress: 'should be present',
      valuationAmount: 'should be numeric',
      confidence: 'should be > 0.8'
    });
  });
});
```

### 2. BrowserStack AI-Powered Testing
**Cloud-based Cross-browser Testing with AI Analytics**

```bash
# Terminal integration for BrowserStack
npm install -g browserstack-cypress-cli
browserstack-cypress init
browserstack-cypress run --config-file cypress.json
```

**AI-Powered Features:**
- Smart test execution optimization
- Automatic bug detection and categorization
- Performance bottleneck identification
- Visual regression testing with AI comparison

### 3. Automated Test Generation with AI
**Using GPT-4 for Dynamic Test Case Creation**

```javascript
// AI test generator service
class AITestGenerator {
  async generateTests(apiEndpoint, schema) {
    const prompt = `Generate comprehensive test cases for ${apiEndpoint} with schema: ${JSON.stringify(schema)}`;
    const testCases = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
    });
    return this.parseTestCases(testCases);
  }
}
```

---

## Terminal & Console Debugging Workflows

### 1. Advanced Console Debugging Strategies

#### Browser Console Enhancement
```javascript
// Enhanced console debugging for AI responses
console.group('🤖 AI Service Debug');
console.time('AI Processing Time');
console.log('Input Data:', inputData);
console.log('AI Model Response:', aiResponse);
console.log('Confidence Score:', confidenceScore);
console.timeEnd('AI Processing Time');
console.groupEnd();

// Performance monitoring
console.table({
  'OCR Processing': '2.3s',
  'AI Analysis': '4.1s',
  'Report Generation': '1.8s'
});
```

#### Terminal-Based Debugging Tools
```bash
# Debug environment setup
export DEBUG=valuation-app:*,ai-service:*,performance:*
export NODE_ENV=debug
export AI_DEBUG_MODE=verbose

# Run with comprehensive logging
npm run dev 2>&1 | tee debug.log

# Real-time log analysis
tail -f debug.log | grep -E "(ERROR|AI_ERROR|PERFORMANCE_WARNING)"
```

### 2. Cypress Terminal Integration

#### Command Line Debugging
```bash
# Cypress with enhanced debugging
export DEBUG=cypress:*
export CYPRESS_DEBUG_MODE=true

# Run tests with detailed output
npx cypress run --browser chrome --headed --no-exit --spec "cypress/e2e/ai-processing.cy.js"

# Interactive debugging mode
npx cypress open --config watchForFileChanges=true,video=true,screenshotOnRunFailure=true
```

#### Custom Cypress Commands for AI Testing
```javascript
// cypress/support/commands.js
Cypress.Commands.add('debugAIResponse', (response) => {
  cy.task('log', {
    timestamp: new Date().toISOString(),
    response: response,
    confidence: response.confidence,
    processingTime: response.processingTime
  });
});

// cypress/support/e2e.js
beforeEach(() => {
  // Enhanced error capturing
  Cypress.on('fail', (error) => {
    cy.task('logError', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  });
});
```

### 3. Jest Terminal Debugging (Backend)

#### Advanced Jest Configuration
```bash
# Debug Jest tests with breakpoints
node --inspect-brk node_modules/.bin/jest --runInBand --detectOpenHandles

# Coverage with AI service focus
npm test -- --coverage --collectCoverageFrom="src/services/ai*.ts" --verbose

# Watch mode with file filtering
npm run test:watch -- --testNamePattern="AI|OpenAI|GoogleVision"
```

#### Terminal Test Output Enhancement
```javascript
// jest.config.js enhancement
module.exports = {
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test-reports',
      filename: 'report.html',
      expand: true
    }],
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'junit.xml'
    }]
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.debug.setup.js']
};

// jest.debug.setup.js
beforeEach(() => {
  console.log(`\n🧪 Starting test: ${expect.getState().currentTestName}`);
  performance.mark('test-start');
});

afterEach(() => {
  performance.mark('test-end');
  performance.measure('test-duration', 'test-start', 'test-end');
  const measure = performance.getEntriesByName('test-duration')[0];
  console.log(`⏱️  Test completed in ${measure.duration.toFixed(2)}ms`);
});
```

---

## Performance Monitoring & AI Model Validation

### 1. Real-Time Performance Tracking

#### Terminal-Based Monitoring Setup
```bash
# Install monitoring tools
npm install --save clinic artillery autocannon

# Performance profiling
clinic doctor -- node dist/index.js
clinic bubbleprof -- node dist/index.js
clinic flame -- node dist/index.js

# API load testing
artillery quick --count 10 --num 100 http://localhost:3001/api/ai/analyze
```

#### AI Model Performance Validation
```javascript
// AI model performance tracker
class AIModelValidator {
  constructor() {
    this.metrics = {
      responseTime: [],
      accuracy: [],
      confidenceScore: [],
      errorRate: 0
    };
  }

  async validateResponse(input, expectedOutput, actualOutput) {
    const startTime = Date.now();

    // Accuracy validation
    const accuracy = this.calculateAccuracy(expectedOutput, actualOutput);
    const confidence = actualOutput.confidence || 0;
    const responseTime = Date.now() - startTime;

    this.metrics.responseTime.push(responseTime);
    this.metrics.accuracy.push(accuracy);
    this.metrics.confidenceScore.push(confidence);

    // Terminal output
    console.log(`📊 AI Validation Results:`);
    console.table({
      'Response Time': `${responseTime}ms`,
      'Accuracy': `${(accuracy * 100).toFixed(2)}%`,
      'Confidence': `${(confidence * 100).toFixed(2)}%`,
      'Status': accuracy > 0.8 ? '✅ PASS' : '❌ FAIL'
    });

    return { accuracy, confidence, responseTime };
  }
}
```

### 2. AI Model Bias Detection
```javascript
// Bias detection for AI responses
class BiasDetector {
  async detectBias(testCases) {
    const results = [];

    for (const testCase of testCases) {
      const response = await this.aiService.analyze(testCase.input);
      const biasScore = this.calculateBiasScore(testCase, response);

      results.push({
        input: testCase.input,
        expectedBias: testCase.expectedBias,
        detectedBias: biasScore,
        isWithinThreshold: biasScore < 0.3
      });
    }

    // Terminal report
    console.log('\n🎯 Bias Detection Report:');
    console.table(results);

    return results;
  }
}
```

---

## Command-Line Testing Tools Integration

### 1. cURL-Based API Testing

#### Automated API Test Scripts
```bash
#!/bin/bash
# api-test-suite.sh

BASE_URL="http://localhost:3001/api"
AUTH_TOKEN=""

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test authentication
test_auth() {
    echo -e "${YELLOW}Testing Authentication...${NC}"

    response=$(curl -s -w "%{http_code}" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"testpass123"}' \
        "${BASE_URL}/auth/login")

    if [[ "${response: -3}" == "200" ]]; then
        echo -e "${GREEN}✅ Authentication: PASSED${NC}"
        AUTH_TOKEN=$(echo $response | jq -r '.token')
    else
        echo -e "${RED}❌ Authentication: FAILED${NC}"
        exit 1
    fi
}

# Test AI document processing
test_ai_processing() {
    echo -e "${YELLOW}Testing AI Document Processing...${NC}"

    response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer ${AUTH_TOKEN}" \
        -F "document=@test-files/sample.pdf" \
        "${BASE_URL}/ai/process-document")

    if [[ "${response: -3}" == "200" ]]; then
        echo -e "${GREEN}✅ AI Processing: PASSED${NC}"
    else
        echo -e "${RED}❌ AI Processing: FAILED${NC}"
    fi
}

# Run all tests
test_auth
test_ai_processing
```

### 2. Newman/Postman Collection Testing
```bash
# Install Newman (Postman CLI)
npm install -g newman

# Run comprehensive API test collection
newman run valuation-app-tests.json \
    --environment production.json \
    --reporters cli,html \
    --reporter-html-export test-results.html

# AI-specific test collection
newman run ai-services-tests.json \
    --environment test.json \
    --iteration-data test-data.csv \
    --reporters cli,json \
    --reporter-json-export ai-test-results.json
```

### 3. Artillery.js Load Testing
```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Load test"
    - duration: 60
      arrivalRate: 100
      name: "Stress test"

scenarios:
  - name: "AI Document Processing Load Test"
    weight: 70
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "testpass123"
          capture:
            - json: "$.token"
              as: "authToken"
      - post:
          url: "/api/ai/process-document"
          headers:
            Authorization: "Bearer {{ authToken }}"
          formData:
            document: "@test-files/sample.pdf"
```

---

## Testing Framework Architecture

### 1. Multi-Layer Testing Strategy

```
┌─────────────────────────────────────────┐
│           E2E Tests (Cypress)            │
│  Full user workflows with AI integration │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│       Integration Tests (Jest)          │
│    API endpoints + AI service mocking   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│         Unit Tests (Jest)               │
│   Individual functions and components   │
└─────────────────────────────────────────┘
```

### 2. Test Environment Configuration

#### Docker Test Environment
```dockerfile
# Dockerfile.test
FROM node:18-alpine

# Install testing dependencies
RUN apk add --no-cache chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Set up test environment
ENV NODE_ENV=test
ENV AI_MOCK_MODE=true
ENV DATABASE_URL=postgresql://test:test@postgres-test:5432/valuation_test

CMD ["npm", "run", "test:all"]
```

#### Test Database Setup
```bash
# test-db-setup.sh
#!/bin/bash

echo "Setting up test database..."

# Create test database
docker run -d --name postgres-test \
    -e POSTGRES_USER=test \
    -e POSTGRES_PASSWORD=test \
    -e POSTGRES_DB=valuation_test \
    -p 5433:5432 \
    postgres:14

# Wait for database to be ready
sleep 10

# Run migrations
npm run db:migrate:test

# Seed test data
npm run db:seed:test

echo "Test database ready!"
```

---

## AI Service Testing Strategies

### 1. OpenAI Service Mocking

#### Mock Response Generator
```javascript
// __tests__/mocks/openaiMock.js
class OpenAIMock {
  constructor() {
    this.responses = new Map();
    this.callCount = 0;
  }

  mockResponse(input, response) {
    this.responses.set(JSON.stringify(input), response);
  }

  async chat.completions.create(params) {
    this.callCount++;
    const key = JSON.stringify(params);

    if (this.responses.has(key)) {
      return this.responses.get(key);
    }

    // Default mock response
    return {
      choices: [{
        message: {
          content: JSON.stringify({
            analysis: "Mock AI analysis",
            confidence: 0.95,
            recommendations: ["Mock recommendation"]
          })
        }
      }]
    };
  }

  getCallCount() {
    return this.callCount;
  }
}

module.exports = OpenAIMock;
```

#### AI Service Integration Tests
```javascript
// __tests__/services/aiIntegration.test.ts
import { OpenAIMock } from '../mocks/openaiMock';
import { AIAnalysisService } from '../../src/services/aiAnalysisService';

describe('AI Service Integration Tests', () => {
  let aiService: AIAnalysisService;
  let openaiMock: OpenAIMock;

  beforeEach(() => {
    openaiMock = new OpenAIMock();
    aiService = new AIAnalysisService(openaiMock);
  });

  describe('Document Analysis', () => {
    it('should analyze property documents with high confidence', async () => {
      // Arrange
      const mockDocument = { content: 'Property valuation document...' };
      const expectedResponse = {
        propertyType: 'residential',
        confidence: 0.92,
        keyFactors: ['location', 'size', 'condition']
      };

      openaiMock.mockResponse(mockDocument, expectedResponse);

      // Act
      const result = await aiService.analyzeDocument(mockDocument);

      // Assert
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.propertyType).toBe('residential');
      expect(openaiMock.getCallCount()).toBe(1);
    });

    it('should handle AI service failures gracefully', async () => {
      // Arrange
      openaiMock.mockResponse = jest.fn().mockRejectedValue(new Error('API Error'));

      // Act & Assert
      await expect(aiService.analyzeDocument({})).rejects.toThrow('AI service temporarily unavailable');
    });
  });
});
```

### 2. Google Vision Service Testing

#### Vision API Mock
```javascript
// __tests__/mocks/googleVisionMock.js
class GoogleVisionMock {
  async textDetection(image) {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return [{
      fullTextAnnotation: {
        text: `PROPERTY VALUATION REPORT
Property Address: 123 Main St, City, State
Estimated Value: $450,000
Date: ${new Date().toISOString().split('T')[0]}
Confidence: High`
      },
      textAnnotations: [
        { description: 'PROPERTY VALUATION REPORT' },
        { description: '123 Main St, City, State' },
        { description: '$450,000' }
      ]
    }];
  }
}
```

### 3. Performance Testing for AI Services

#### AI Response Time Validation
```javascript
// __tests__/performance/aiPerformance.test.ts
describe('AI Service Performance Tests', () => {
  const RESPONSE_TIME_THRESHOLD = 5000; // 5 seconds

  it('should process documents within acceptable time limits', async () => {
    const startTime = Date.now();

    const result = await aiService.processDocument(largeTestDocument);

    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD);
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it('should handle concurrent requests efficiently', async () => {
    const concurrentRequests = Array(10).fill().map(() =>
      aiService.processDocument(testDocument)
    );

    const startTime = Date.now();
    const results = await Promise.all(concurrentRequests);
    const totalTime = Date.now() - startTime;

    expect(totalTime).toBeLessThan(RESPONSE_TIME_THRESHOLD * 3); // Allow for some overhead
    expect(results.every(r => r.confidence > 0.5)).toBe(true);
  });
});
```

---

## Debugging Methodologies

### 1. Systematic Debugging Approach

#### Debug Information Collection
```javascript
// src/utils/debugCollector.ts
class DebugCollector {
  constructor() {
    this.debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version,
      requestId: null,
      userAgent: null,
      errors: [],
      performance: {},
      aiMetrics: {}
    };
  }

  collectRequestInfo(req: Request) {
    this.debugInfo.requestId = req.headers['x-request-id'];
    this.debugInfo.userAgent = req.headers['user-agent'];
    this.debugInfo.method = req.method;
    this.debugInfo.path = req.path;
  }

  collectAIMetrics(service: string, metrics: any) {
    this.debugInfo.aiMetrics[service] = {
      ...metrics,
      timestamp: new Date().toISOString()
    };
  }

  addError(error: Error, context?: any) {
    this.debugInfo.errors.push({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }

  export() {
    return JSON.stringify(this.debugInfo, null, 2);
  }
}
```

#### Terminal Debug Output
```bash
# Debug output formatter
debug_log() {
    echo -e "\n🔍 $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

error_log() {
    echo -e "\n❌ $(date '+%Y-%m-%d %H:%M:%S') - ERROR: $1" >&2
}

performance_log() {
    echo -e "\n⏱️  $(date '+%Y-%m-%d %H:%M:%S') - PERF: $1"
}

# Usage in testing
debug_log "Starting AI service test suite..."
performance_log "Document processing took ${duration}ms"
error_log "AI confidence below threshold: ${confidence}"
```

### 2. Error Tracking and Analysis

#### Automated Error Analysis
```javascript
// src/utils/errorAnalyzer.ts
class ErrorAnalyzer {
  async analyzeError(error: Error, context: any) {
    const analysis = {
      errorType: this.classifyError(error),
      severity: this.calculateSeverity(error, context),
      possibleCauses: this.identifyPossibleCauses(error, context),
      suggestedFixes: await this.generateFixes(error, context),
      relatedIssues: await this.findRelatedIssues(error)
    };

    // Terminal output
    console.group('🔍 Error Analysis Report');
    console.log('Error Type:', analysis.errorType);
    console.log('Severity:', analysis.severity);
    console.log('Possible Causes:', analysis.possibleCauses);
    console.log('Suggested Fixes:', analysis.suggestedFixes);
    console.groupEnd();

    return analysis;
  }

  private classifyError(error: Error): string {
    if (error.message.includes('OpenAI')) return 'AI_SERVICE_ERROR';
    if (error.message.includes('Vision')) return 'OCR_SERVICE_ERROR';
    if (error.message.includes('timeout')) return 'TIMEOUT_ERROR';
    if (error.message.includes('validation')) return 'VALIDATION_ERROR';
    return 'UNKNOWN_ERROR';
  }
}
```

---

## Production Monitoring & Alerting

### 1. Real-Time Health Monitoring

#### Health Check Endpoints
```javascript
// src/routes/health.ts
export const healthRouter = express.Router();

healthRouter.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
    services: {
      database: await checkDatabaseHealth(),
      openai: await checkOpenAIHealth(),
      googleVision: await checkGoogleVisionHealth(),
      redis: await checkRedisHealth()
    },
    performance: {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      activeConnections: getActiveConnections()
    }
  };

  const isHealthy = Object.values(health.services).every(service => service.status === 'healthy');

  res.status(isHealthy ? 200 : 503).json(health);
});
```

#### Terminal Monitoring Script
```bash
#!/bin/bash
# monitor.sh - Production monitoring script

API_URL="http://localhost:3001/api/health"
ALERT_THRESHOLD=5
ERROR_COUNT=0

monitor_health() {
    response=$(curl -s -w "%{http_code}" "${API_URL}")
    status_code="${response: -3}"

    if [[ "$status_code" != "200" ]]; then
        ((ERROR_COUNT++))
        echo -e "❌ Health check failed (${ERROR_COUNT}/${ALERT_THRESHOLD}): HTTP ${status_code}"

        if [[ $ERROR_COUNT -ge $ALERT_THRESHOLD ]]; then
            send_alert "Health check failures exceeded threshold"
        fi
    else
        ERROR_COUNT=0
        echo -e "✅ System healthy at $(date)"
    fi
}

send_alert() {
    echo -e "🚨 ALERT: $1"
    # Add webhook notification, email, etc.
}

# Monitor every 30 seconds
while true; do
    monitor_health
    sleep 30
done
```

### 2. Performance Alerting System

#### Automated Performance Monitoring
```javascript
// src/middleware/performanceAlert.ts
class PerformanceAlertSystem {
  private thresholds = {
    responseTime: 5000, // 5 seconds
    memoryUsage: 0.8,   // 80% of available memory
    errorRate: 0.05,    // 5% error rate
    aiConfidence: 0.7   // 70% minimum confidence
  };

  async checkPerformance(metrics: PerformanceMetrics) {
    const alerts = [];

    if (metrics.responseTime > this.thresholds.responseTime) {
      alerts.push({
        type: 'SLOW_RESPONSE',
        message: `Response time ${metrics.responseTime}ms exceeds threshold`,
        severity: 'WARNING'
      });
    }

    if (metrics.aiConfidence < this.thresholds.aiConfidence) {
      alerts.push({
        type: 'LOW_AI_CONFIDENCE',
        message: `AI confidence ${metrics.aiConfidence} below acceptable threshold`,
        severity: 'CRITICAL'
      });
    }

    // Send alerts to terminal and external systems
    alerts.forEach(alert => this.sendAlert(alert));
  }

  private sendAlert(alert: Alert) {
    // Terminal output
    const color = alert.severity === 'CRITICAL' ? '\x1b[31m' : '\x1b[33m';
    console.log(`${color}🚨 ${alert.type}: ${alert.message}\x1b[0m`);

    // External alerting (webhook, email, etc.)
    this.sendExternalAlert(alert);
  }
}
```

---

## Implementation Checklist

### Phase 1: Foundation Setup ✅
- [ ] Create comprehensive test documentation
- [ ] Set up test environment configuration
- [ ] Configure debugging tools
- [ ] Establish monitoring baseline

### Phase 2: Testing Framework Enhancement
- [ ] Expand Jest test coverage to 90%
- [ ] Configure Cypress E2E testing
- [ ] Implement AI service mocking
- [ ] Set up performance testing

### Phase 3: Debugging & Monitoring
- [ ] Deploy real-time monitoring
- [ ] Configure automated alerting
- [ ] Implement error analysis
- [ ] Set up production debugging tools

### Phase 4: Automation & Integration
- [ ] Configure CI/CD test automation
- [ ] Implement AI-powered test generation
- [ ] Deploy automated regression testing
- [ ] Enable continuous monitoring

---

## Success Metrics

- **Test Coverage**: 90%+ across all services
- **AI Confidence**: 85%+ average confidence score
- **Response Time**: <2s for 95% of requests
- **Error Rate**: <1% in production
- **Detection Time**: Critical issues detected within 1 minute
- **Resolution Time**: 95% of issues resolved within 15 minutes

---

## Tools & Technologies

### Terminal/Console Tools
- **Cypress CLI**: E2E testing with headless mode
- **Jest**: Unit and integration testing with debugging
- **Artillery**: Load testing and performance validation
- **Newman**: Postman collection automation
- **cURL**: API endpoint validation

### AI-Powered Testing
- **KaneAI**: Natural language test generation
- **BrowserStack**: Cross-browser AI testing
- **OpenAI GPT-4**: Automated test case generation
- **Custom AI Validators**: Model performance validation

### Monitoring & Debugging
- **Winston**: Structured logging with multiple transports
- **Prometheus**: Metrics collection and alerting
- **Custom Health Checks**: Service-specific monitoring
- **Performance Profilers**: Memory and CPU monitoring

---

*Last Updated: September 14, 2025*
*Next Review: Weekly during implementation*
