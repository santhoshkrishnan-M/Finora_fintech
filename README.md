# 🏦 FINORA - Vernacular Financial Guidance Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

**A production-ready, vernacular-first financial guidance platform designed for Indian users**

[Features](#-features) • [Tech Stack](#️-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#️-database-schema)
- [Multilingual Support](#-multilingual-support)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 📌 About

FINORA is an innovative financial literacy platform that bridges the gap between financial knowledge and vernacular users across India. The platform provides personalized financial education and planning tools without involving trading or stock execution, making it safe and accessible for beginners.

### Why FINORA?

- **Vernacular-First**: Support for 6 Indian languages with culturally adapted content
- **Educational Focus**: No trading, no stock recommendations - purely educational
- **AI-Powered**: Personalized guidance using Google Gemini AI
- **User-Centric**: Tailored experiences for Students, Farmers, Women, and Working Professionals

---

## ✨ Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Multi-language Support** | English, Tamil, Hindi, Telugu, Malayalam, Kannada |
| **User Segmentation** | Students, Farmers, Women, Working Professionals |
| **Budget Planner** | Dynamic monthly budget tracking with category management |
| **Savings Strategies** | SIP, SWP, RD, Emergency Fund guidance with AI explanations |
| **Learning Scenarios** | Real-world financial situations with AI-powered feedback |
| **Learning Paths** | Structured financial education modules with progress tracking |
| **Secure Authentication** | JWT-based authentication with bcrypt password hashing |
| **AI Assistant (FRIDAY)** | Context-aware financial guidance chatbot |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Internationalization**: next-intl

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **AI Integration**: Google Gemini API

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14.0 or higher ([Download](https://www.postgresql.org/download/))
- **Git** (for version control)
- **Google Gemini API Key** ([Get Free Key](https://makersuite.google.com/app/apikey))

---

## 📥 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/santhoshkrishnan-M/Finora_fintech.git
cd Finora_fintech
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Database Setup

#### Create PostgreSQL Database

**Windows (PowerShell):**
```powershell
psql -U postgres -c "CREATE DATABASE finora;"
```

**macOS/Linux:**
```bash
sudo -u postgres psql -c "CREATE DATABASE finora;"
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/finora?schema=public"

# JWT Secret (⚠️ Change this in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key-here"

# Application URLs
NODE_ENV="development"
API_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database Migration

Initialize and migrate the database schema:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database with initial data
npm run prisma:seed

# (Optional) Open Prisma Studio
npm run prisma:studio
```

---

## 🚀 Usage

### Development Mode

Run the application in development mode with hot-reload:

#### Option 1: Concurrent Mode (Recommended)

```bash
npm run dev:all
```

#### Option 2: Separate Terminals

**Terminal 1 - Backend Server:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Prisma Studio**: [http://localhost:5555](http://localhost:5555)

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🎯 User Journey

### Application Flow

```mermaid
graph TD
    A[Landing Page] --> B[Sign Up / Login]
    B --> C[Onboarding]
    C --> D[Complete Profile]
    D --> E[Dashboard]
    E --> F[Budget Planner]
    E --> G[Savings Strategies]
    E --> H[Learning Scenarios]
    E --> I[Learning Paths]
```

1. **Sign Up / Login**: Create an account or authenticate
2. **Onboarding**: Complete financial profile with demographic info
3. **Dashboard**: Access all platform features
4. **Budget Planner**: Create and track monthly budgets
5. **Savings Strategies**: Get AI-powered personalized recommendations
6. **Scenarios**: Practice financial decision-making with real-world situations
7. **Learning Path**: Follow structured financial education courses

---

## 📁 Project Structure

```
finora/
├── 📂 prisma/
│   ├── schema.prisma              # Database schema and models
│   ├── seed.js                    # Database seeding script
│   └── migrations/                # Database migration history
│
├── 📂 server/
│   ├── index.js                   # Express server entry point
│   ├── 📂 routes/                 # API route handlers
│   │   ├── auth.js               # Authentication endpoints
│   │   ├── profile.js            # User profile management
│   │   ├── budget.js             # Budget planner endpoints
│   │   ├── savings.js            # Savings strategies
│   │   ├── scenarios.js          # Learning scenarios
│   │   ├── learning.js           # Learning paths
│   │   └── friday.js             # AI chatbot integration
│   ├── 📂 services/               # Business logic layer
│   │   └── gemini.js             # Google Gemini AI service
│   ├── 📂 middleware/             # Express middleware
│   │   └── auth.js               # JWT authentication
│   └── 📂 lib/                    # Utilities
│       └── prisma.js             # Prisma client instance
│
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Global styles
│   │   ├── 📂 auth/              # Authentication pages
│   │   │   ├── login/            
│   │   │   └── signup/           
│   │   ├── 📂 onboarding/        # User profiling
│   │   ├── 📂 dashboard/         # Main dashboard
│   │   ├── 📂 budget/            # Budget planner UI
│   │   ├── 📂 savings/           # Savings strategies UI
│   │   ├── 📂 scenarios/         # Learning scenarios UI
│   │   ├── 📂 learning/          # Learning paths UI
│   │   └── 📂 profile/           # User profile management
│   │
│   ├── 📂 components/             # Reusable React components
│   │   ├── FRIDAYChat.tsx        # AI chatbot component
│   │   ├── LanguageProvider.tsx  # i18n context provider
│   │   ├── LanguageSwitcher.tsx  # Language selector
│   │   ├── SectionGuidanceModal.tsx
│   │   └── 📂 ui/                # UI component library
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   │
│   ├── 📂 lib/                    # Utility functions
│   │   ├── api.ts                # API client
│   │   └── utils.ts              # Helper functions
│   │
│   ├── 📂 store/                  # Zustand state management
│   │   ├── authStore.ts          # Authentication state
│   │   ├── languageStore.ts      # Language preferences
│   │   └── profileStore.ts       # User profile state
│   │
│   └── 📂 i18n/                   # Internationalization
│       ├── request.ts            # i18n configuration
│       └── 📂 messages/           # Translation files
│           ├── en.json           # English
│           ├── hi.json           # Hindi
│           ├── ta.json           # Tamil
│           ├── te.json           # Telugu
│           ├── ml.json           # Malayalam
│           └── kn.json           # Kannada
│
├── 📄 .env                        # Environment variables (not in git)
├── 📄 package.json                # Dependencies and scripts
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 next.config.js              # Next.js configuration
├── 📄 tailwind.config.js          # Tailwind CSS configuration
└── 📄 README.md                   # This file
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Profile Management

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

#### Create/Update Profile
```http
POST /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "ageRange": "25-35",
  "category": "WORKING_PROFESSIONAL",
  "language": "en",
  "monthlyIncome": 50000,
  "monthlyExpenses": 30000,
  "financialGoals": ["SAVINGS", "INVESTMENT"],
  "riskLevel": "MODERATE"
}
```

### Budget Management

#### Get Monthly Budget
```http
GET /api/budget/:year/:month
Authorization: Bearer <token>
```

#### Create/Update Budget
```http
POST /api/budget
Authorization: Bearer <token>
Content-Type: application/json

{
  "year": 2026,
  "month": 2,
  "totalIncome": 50000,
  "totalExpenses": 30000,
  "categories": [...]
}
```

### Savings Strategies

#### Get All Strategies
```http
GET /api/savings
Authorization: Bearer <token>
```

#### Generate AI Strategy
```http
POST /api/savings/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "strategyType": "SIP",
  "monthlyAmount": 5000,
  "duration": 60
}
```

### Learning & Scenarios

#### Get Learning Paths
```http
GET /api/learning/paths
Authorization: Bearer <token>
```

#### Submit Scenario Attempt
```http
POST /api/scenarios/attempt
Authorization: Bearer <token>
Content-Type: application/json

{
  "scenarioId": "uuid",
  "selectedOption": "optionId",
  "reasoning": "User's explanation"
}
```

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🗄️ Database Schema

### Core Models

```prisma
model User {
  id                String              @id @default(uuid())
  email             String              @unique
  password          String
  name              String?
  hasProfile        Boolean             @default(false)
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  // Relations
  financialProfile  FinancialProfile?
  budgets           Budget[]
  savingsStrategies SavingsStrategy[]
  scenarios         ScenarioAttempt[]
  learningProgress  LearningProgress[]
}

model FinancialProfile {
  id                String   @id @default(uuid())
  userId            String   @unique
  ageRange          String
  category          String
  language          String   @default("en")
  monthlyIncome     Float
  monthlyExpenses   Float
  financialGoals    String[]
  riskLevel         String
  
  user              User     @relation(fields: [userId], references: [id])
}

model Budget {
  id              String            @id @default(uuid())
  userId          String
  year            Int
  month           Int
  totalIncome     Float
  totalExpenses   Float
  
  user            User              @relation(fields: [userId], references: [id])
  categories      BudgetCategory[]
}
```

For complete schema, see [prisma/schema.prisma](./prisma/schema.prisma)

---

## 🌐 Multilingual Support

FINORA supports 6 Indian languages with culturally adapted content:

| Language | Code | Status | Coverage |
|----------|------|--------|----------|
| English | `en` | ✅ Complete | 100% |
| Hindi | `hi` | ✅ Complete | 100% |
| Tamil | `ta` | ✅ Complete | 100% |
| Telugu | `te` | ✅ Complete | 100% |
| Malayalam | `ml` | ✅ Complete | 100% |
| Kannada | `kn` | ✅ Complete | 100% |

### Adding New Translations

1. Create a new JSON file in `src/i18n/messages/`
2. Copy structure from `en.json`
3. Translate all keys
4. Update language switcher component

Translation files include:
- UI labels and buttons
- Form validations
- Error messages
- Financial terminology
- Educational content

---

## 🔐 Security

### Security Measures Implemented

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | bcrypt with 10 salt rounds |
| **Authentication** | JWT tokens with expiration |
| **SQL Injection** | Protected via Prisma ORM |
| **Input Validation** | Zod schema validation |
| **Environment Variables** | Sensitive data in `.env` |
| **CORS** | Configured for specific origins |
| **Rate Limiting** | *(Recommended for production)* |

### Best Practices

- Never commit `.env` file
- Use strong JWT secrets (min 256 bits)
- Implement HTTPS in production
- Regular dependency updates
- Sanitize user inputs
- Implement rate limiting for APIs

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
psql -U postgres

# Reset database
npm run prisma:migrate reset
```

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Prisma Issues
```bash
# Regenerate Prisma Client
npm run prisma:generate

# If schema changed, create migration
npx prisma migrate dev --name your_migration_name

# Reset database completely
npm run prisma:migrate reset
```

### JWT Authentication Fails

**Problem**: "Invalid token" or authentication errors

**Solution**:
- Ensure `JWT_SECRET` is set in `.env`
- Clear browser cookies/localStorage
- Check token expiration settings

### Gemini API Errors

**Problem**: AI responses fail or timeout

**Solution**:
- Verify `GEMINI_API_KEY` in `.env`
- Check API quota limits
- Test API key at [Google AI Studio](https://makersuite.google.com/)

---

## 🎨 Design Principles

### UI/UX Guidelines

- ✅ **No emojis** in the user interface
- ✅ **Professional** fintech design aesthetic
- ✅ **High contrast** and WCAG AA accessible
- ✅ **Beginner-friendly** layouts and interactions
- ✅ **Clean and minimal** interface design
- ✅ **Educational** focus in all content

---

## 🤖 AI Integration

### Google Gemini API Usage

The platform uses Google Gemini AI for:

| Feature | Purpose |
|---------|---------|
| **Strategy Explanation** | Simplifying financial concepts |
| **Personalized Scenarios** | Creating contextual learning situations |
| **Decision Feedback** | Providing constructive guidance |
| **Content Adaptation** | Tailoring to user demographics |

### AI Guidelines

- ❌ No market predictions or forecasts
- ❌ No stock recommendations
- ✅ Simple, clear language
- ✅ Educational focus only
- ✅ Culturally appropriate content
- ✅ Beginner-friendly explanations

---

## 📝 Development Guidelines

### Adding New Features
1. Update Prisma schema if needed
2. Create/update API routes
3. Create frontend pages/components
4. Add translations for all languages
5. Test thoroughly

### Code Standards
- ✅ Use TypeScript for type safety
- ✅ Follow REST API conventions
- ✅ Validate all inputs
- ✅ Handle errors gracefully
- ✅ Write clear comments

---

## 🚀 Deployment Checklist

### Pre-Production Steps

- [ ] Update JWT_SECRET with strong random string (min 256 bits)
- [ ] Set up production PostgreSQL database
- [ ] Configure production environment variables
- [ ] Update CORS settings for production domain
- [ ] Test all API endpoints
- [ ] Verify multilingual content
- [ ] Test authentication flow
- [ ] Optimize images and assets
- [ ] Set up monitoring and logging
- [ ] Configure SSL/HTTPS
- [ ] Enable rate limiting
- [ ] Database backup strategy

---

## 🤝 Contributing

We welcome contributions to FINORA!

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add new feature"`
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Create** a Pull Request

### Commit Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 💬 Support

### Getting Help

- 📖 **Documentation**: Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Submit via GitHub Issues

### Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Quick Start](./QUICKSTART.md)
- [Feature List](./FEATURES.md)

---

## 🎯 Roadmap

### Phase 1: Foundation ✅ Complete
- [x] User authentication system
- [x] Multi-language support (6 languages)
- [x] Budget planner with category tracking
- [x] Savings strategies (SIP, SWP, RD, Emergency Fund)
- [x] Learning scenarios with AI feedback
- [x] AI chatbot integration (FRIDAY)

### Phase 2: Enhancement 🚧 In Progress
- [ ] Advanced data visualization and charts
- [ ] Export reports (PDF/Excel)
- [ ] Email/SMS notifications
- [ ] Mobile app (React Native)
- [ ] Gamification elements
- [ ] Social sharing features

### Phase 3: Expansion 📅 Planned
- [ ] Investment basics module
- [ ] Tax calculator tool
- [ ] Insurance planning guidance
- [ ] Retirement planning calculator
- [ ] Community forums
- [ ] Expert consultations

---

## 🏆 Acknowledgments

Built with powerful tools and frameworks:

- **Google Gemini AI** for AI capabilities
- **Vercel** for Next.js framework
- **Prisma** for database ORM
- **Shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **Radix UI** for accessible components

---

## 📊 Project Stats

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

---

<div align="center">

**[⬆ Back to Top](#-finora---vernacular-financial-guidance-platform)**

Made with 💙 for financial literacy in India

**Repository**: [github.com/santhoshkrishnan-M/Finora_fintech](https://github.com/santhoshkrishnan-M/Finora_fintech)

</div>

---

**Built with ❤️ for financial education in India**
#   F i n o r a _ f i n t e c h 
 
 