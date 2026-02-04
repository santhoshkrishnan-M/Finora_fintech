# FINORA API Documentation

Base URL: `http://localhost:3001/api`

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### POST /auth/login
Login existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "hasProfile": true
  }
}
```

---

## Profile Endpoints

### GET /profile
Get user's financial profile. *(Requires Auth)*

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "ageRange": "26-35",
  "userCategory": "professional",
  "language": "en",
  "monthlyIncome": 50000,
  "monthlyExpenses": 30000,
  "financialGoals": ["Emergency Fund", "Retirement Planning"],
  "riskComfortLevel": "medium",
  "hasEmergencyFund": false,
  "currentSavings": 100000,
  "createdAt": "2026-02-04T...",
  "updatedAt": "2026-02-04T..."
}
```

### POST /profile
Create or update financial profile. *(Requires Auth)*

**Request Body:**
```json
{
  "ageRange": "26-35",
  "userCategory": "professional",
  "language": "en",
  "monthlyIncome": 50000,
  "monthlyExpenses": 30000,
  "financialGoals": ["Emergency Fund", "Retirement Planning"],
  "riskComfortLevel": "medium",
  "hasEmergencyFund": false,
  "currentSavings": 100000
}
```

**Valid Values:**
- `userCategory`: "student", "farmer", "woman", "professional"
- `language`: "en", "ta", "hi", "te", "ml", "kn"
- `riskComfortLevel`: "low", "medium", "high"

---

## Budget Endpoints

### GET /budget/:year/:month
Get budget for specific month. *(Requires Auth)*

**Example:** `/budget/2026/2026-02`

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "month": "2026-02",
  "year": 2026,
  "totalIncome": 50000,
  "categories": [
    {
      "id": "uuid",
      "name": "Housing",
      "planned": 15000,
      "actual": 15000
    },
    {
      "id": "uuid",
      "name": "Food",
      "planned": 8000,
      "actual": 7500
    }
  ],
  "createdAt": "2026-02-04T...",
  "updatedAt": "2026-02-04T..."
}
```

### POST /budget
Create or update budget. *(Requires Auth)*

**Request Body:**
```json
{
  "month": "2026-02",
  "year": 2026,
  "totalIncome": 50000,
  "categories": [
    {
      "name": "Housing",
      "planned": 15000,
      "actual": 0
    },
    {
      "name": "Food",
      "planned": 8000,
      "actual": 0
    }
  ]
}
```

### PATCH /budget/category/:categoryId
Update category actual amount. *(Requires Auth)*

**Request Body:**
```json
{
  "actual": 7500
}
```

---

## Savings Endpoints

### GET /savings
Get all user's savings strategies. *(Requires Auth)*

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "strategyType": "SIP",
    "monthlyAmount": 5000,
    "targetAmount": 500000,
    "duration": 60,
    "explanation": "AI-generated explanation...",
    "recommendations": "AI-generated recommendations...",
    "isActive": true,
    "createdAt": "2026-02-04T...",
    "updatedAt": "2026-02-04T..."
  }
]
```

### POST /savings/generate
Generate new savings strategy with AI explanation. *(Requires Auth)*

**Request Body:**
```json
{
  "strategyType": "SIP",
  "monthlyAmount": 5000,
  "targetAmount": 500000,
  "duration": 60
}
```

**Strategy Types:**
- `SIP`: Systematic Investment Plan
- `SWP`: Systematic Withdrawal Plan
- `RD`: Recurring Deposit
- `EMERGENCY_FUND`: Emergency Fund (auto-calculated if no amounts provided)

**Response:**
```json
{
  "message": "Strategy generated successfully",
  "strategy": {
    "id": "uuid",
    "strategyType": "SIP",
    "monthlyAmount": 5000,
    "targetAmount": 500000,
    "duration": 60,
    "explanation": "Detailed AI-generated explanation based on your profile...",
    "isActive": true
  }
}
```

### PATCH /savings/:strategyId/toggle
Toggle strategy active status. *(Requires Auth)*

**Response:**
```json
{
  "message": "Strategy updated successfully",
  "strategy": {
    "id": "uuid",
    "isActive": false
  }
}
```

---

## Scenario Endpoints

### GET /scenarios
Get scenarios for user's category and language. *(Requires Auth)*

**Response:**
```json
[
  {
    "id": "uuid",
    "category": "professional",
    "language": "en",
    "title": "Year-End Bonus Decision",
    "description": "You received a bonus...",
    "situation": "Your company has given you...",
    "difficultyLevel": "intermediate",
    "options": [
      {
        "id": "uuid",
        "optionText": "Invest in SIP...",
        "isCorrect": true,
        "explanation": "Great choice because..."
      }
    ]
  }
]
```

### POST /scenarios/attempt
Submit scenario attempt and get AI feedback. *(Requires Auth)*

**Request Body:**
```json
{
  "scenarioId": "uuid",
  "selectedOptionId": "uuid"
}
```

**Response:**
```json
{
  "isCorrect": true,
  "explanation": "Great choice because...",
  "feedback": "Personalized AI-generated feedback based on your profile and decision...",
  "attempt": {
    "id": "uuid",
    "scenarioId": "uuid",
    "selectedOption": "uuid",
    "isCorrect": true,
    "createdAt": "2026-02-04T..."
  }
}
```

### GET /scenarios/attempts
Get user's scenario attempt history. *(Requires Auth)*

**Response:**
```json
[
  {
    "id": "uuid",
    "scenarioId": "uuid",
    "selectedOption": "uuid",
    "isCorrect": true,
    "feedback": "AI feedback...",
    "scenario": {
      "title": "First Job Salary Decision",
      "category": "student"
    },
    "createdAt": "2026-02-04T..."
  }
]
```

---

## Learning Endpoints

### GET /learning/paths
Get learning paths for user's category and language. *(Requires Auth)*

**Response:**
```json
[
  {
    "id": "uuid",
    "category": "professional",
    "language": "en",
    "title": "Wealth Building for Professionals",
    "description": "Advanced strategies...",
    "modules": [
      {
        "id": "uuid",
        "order": 1,
        "title": "Understanding Your Income",
        "content": "Detailed lesson content...",
        "moduleType": "lesson"
      }
    ],
    "userProgress": {
      "completedModules": ["module-id-1"],
      "currentModule": "module-id-2",
      "progress": 33.33
    }
  }
]
```

### GET /learning/paths/:pathId
Get specific learning path. *(Requires Auth)*

**Response:**
```json
{
  "id": "uuid",
  "title": "Financial Basics for Students",
  "modules": [...],
  "userProgress": {
    "completedModules": [],
    "currentModule": null,
    "progress": 0
  }
}
```

### POST /learning/progress
Update learning progress. *(Requires Auth)*

**Request Body:**
```json
{
  "pathId": "uuid",
  "moduleId": "uuid",
  "isCompleted": true
}
```

**Response:**
```json
{
  "message": "Progress updated successfully",
  "progress": {
    "id": "uuid",
    "userId": "uuid",
    "pathId": "uuid",
    "completedModules": ["module-id-1", "module-id-2"],
    "currentModule": "module-id-3",
    "progress": 66.67
  }
}
```

---

## Error Responses

All endpoints may return error responses:

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Profile not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!",
  "message": "Detailed error message (only in development)"
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider:
- Authentication: 5 attempts per 15 minutes per IP
- AI endpoints: 10 requests per minute per user
- General API: 100 requests per minute per user

---

## AI Integration Details

### Gemini API Usage

The following endpoints use Google Gemini AI:

1. **POST /savings/generate**
   - Generates personalized financial strategy explanations
   - Considers user profile, category, income, and goals
   - Returns educational, non-promotional content

2. **POST /scenarios/attempt**
   - Generates personalized feedback on user decisions
   - Analyzes decision quality based on user profile
   - Provides learning-focused guidance

### AI Response Guidelines

All AI responses:
- Are tailored to user's category and profile
- Use simple, beginner-friendly language
- Avoid market predictions or stock tips
- Focus on financial education
- Are culturally appropriate for Indian users

---

## Testing the API

### Using cURL:

```bash
# Sign up
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get profile (use token from login response)
curl http://localhost:3001/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript (fetch):

```javascript
// Login
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();

// Use token for authenticated requests
const profile = await fetch('http://localhost:3001/api/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## WebSocket Support

Currently not implemented. Future enhancements may include:
- Real-time budget updates
- Live financial tips
- Progress notifications

---

## API Versioning

Current version: v1 (implicit)
Future versions will use: `/api/v2/...`

---

**Last Updated:** February 4, 2026
**API Version:** 1.0.0
