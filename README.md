# FINORA - Vernacular Financial Guidance Platform

FINORA is a production-ready, vernacular-first financial guidance platform designed for Indian users. It provides personalized financial education and planning tools without involving trading or stock execution.

## 🎯 Core Features

- **Multi-language Support**: English, Tamil, Hindi, Telugu, Malayalam, Kannada
- **User Segmentation**: Students, Farmers, Women, Working Professionals
- **Budget Planner**: Dynamic monthly budget tracking
- **Savings Strategies**: SIP, SWP, RD, Emergency Fund guidance with AI explanations
- **Learning Scenarios**: Real-world financial situations with AI feedback
- **Learning Paths**: Structured financial education modules
- **Secure Authentication**: JWT-based authentication system

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI
- Zustand (State Management)
- next-intl (Internationalization)

### Backend
- Node.js + Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Google Gemini API

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- PostgreSQL installed and running
- Google Gemini API key (free tier available)

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd "C:\Users\Mahalakshmi Mohan\OneDrive\Desktop\Finora"
npm install
```

### 2. Set up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/finora?schema=public"

# JWT Secret (change this!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key-here"

# App Configuration
NODE_ENV="development"
API_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. Set up PostgreSQL Database

#### Windows (using PowerShell):

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE finora;"

# Update DATABASE_URL in .env with your PostgreSQL credentials
```

### 4. Initialize Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 5. Get Google Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key and add it to your `.env` file

### 6. Start the Application

Open two terminal windows:

**Terminal 1 - Backend Server:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 7. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📱 Application Flow

1. **Sign Up / Login**: Create an account or log in
2. **Onboarding**: Complete your financial profile
3. **Dashboard**: Access all features
4. **Budget Planner**: Create and track monthly budgets
5. **Savings Strategies**: Get AI-powered savings recommendations
6. **Scenarios**: Practice financial decision-making
7. **Learning Path**: Follow structured financial education

## 🌐 Multilingual Support

The application supports 6 languages with culturally adapted content:
- English (en)
- Tamil (ta)
- Hindi (hi)
- Telugu (te)
- Malayalam (ml)
- Kannada (kn)

Translation files are located in: `src/i18n/messages/`

## 🗄️ Database Schema

Key models:
- **User**: Authentication and user data
- **FinancialProfile**: User demographics and preferences
- **Budget**: Monthly budget tracking
- **SavingsStrategy**: Personalized savings plans
- **Scenario**: Financial learning scenarios
- **LearningPath**: Structured education modules
- **LearningProgress**: User progress tracking

## 🔐 Security Features

- Bcrypt password hashing
- JWT token authentication
- Input validation with Zod
- SQL injection protection via Prisma
- Environment variable protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login

### Profile
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create/update profile

### Budget
- `GET /api/budget/:year/:month` - Get budget
- `POST /api/budget` - Create/update budget
- `PATCH /api/budget/category/:id` - Update category

### Savings
- `GET /api/savings` - Get all strategies
- `POST /api/savings/generate` - Generate new strategy
- `PATCH /api/savings/:id/toggle` - Toggle strategy

### Scenarios
- `GET /api/scenarios` - Get scenarios
- `POST /api/scenarios/attempt` - Submit attempt
- `GET /api/scenarios/attempts` - Get history

### Learning
- `GET /api/learning/paths` - Get learning paths
- `GET /api/learning/paths/:id` - Get specific path
- `POST /api/learning/progress` - Update progress

## 🧪 Testing the Application

### Test User Flow:

1. **Sign Up**
   - Email: test@example.com
   - Password: password123

2. **Complete Onboarding**
   - Select age range, category, language
   - Enter monthly income/expenses
   - Choose financial goals and risk level

3. **Explore Features**
   - Create a budget
   - Generate savings strategy
   - Try scenarios
   - Follow learning path

## 🛣️ Project Structure

```
finora/
├── prisma/
│   └── schema.prisma          # Database schema
├── server/
│   ├── index.js               # Express server
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── middleware/            # Auth middleware
│   └── lib/                   # Utilities
├── src/
│   ├── app/                   # Next.js pages
│   │   ├── auth/             # Login/Signup
│   │   ├── onboarding/       # User profiling
│   │   ├── dashboard/        # Main dashboard
│   │   ├── budget/           # Budget planner
│   │   ├── savings/          # Savings strategies
│   │   ├── scenarios/        # Learning scenarios
│   │   └── learning/         # Learning paths
│   ├── components/           # Reusable components
│   │   └── ui/              # UI components
│   ├── lib/                  # Utilities & API
│   ├── store/                # Zustand stores
│   └── i18n/                 # Translations
├── .env                      # Environment variables
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🎨 Design Principles

- **No emojis** in UI
- **Professional** fintech design
- **High contrast** and accessible
- **Beginner-friendly** layouts
- **Clean and minimal** interface
- **Educational** focus

## 🤖 AI Integration

Google Gemini API is used for:
- Explaining financial strategies
- Generating personalized scenarios
- Providing decision feedback
- Tailoring content to user profile

**AI Guidelines:**
- No market predictions
- No stock recommendations
- Simple, clear language
- Educational focus
- Culturally appropriate

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

# Create new migration
npx prisma migrate dev --name init
```

## 📝 Development Guidelines

### Adding New Features
1. Update Prisma schema if needed
2. Create/update API routes
3. Create frontend pages/components
4. Add translations for all languages
5. Test thoroughly

### Code Standards
- Use TypeScript for type safety
- Follow REST API conventions
- Validate all inputs
- Handle errors gracefully
- Write clear comments

## 🚀 Deployment Checklist

- [ ] Update JWT_SECRET with strong random string
- [ ] Set up production PostgreSQL database
- [ ] Configure production environment variables
- [ ] Update CORS settings for production domain
- [ ] Test all API endpoints
- [ ] Verify multilingual content
- [ ] Test authentication flow
- [ ] Optimize images and assets
- [ ] Set up monitoring and logging
- [ ] Configure SSL/HTTPS

## 📄 License

This is a private educational project.

## 🤝 Support

For issues or questions, please refer to the inline code comments or check the API route files in `server/routes/`.

## 🎯 Next Steps

The core foundation is complete. You can now:
1. Expand the Budget Planner UI
2. Add more financial scenarios
3. Create detailed learning modules
4. Enhance AI prompts for better responses
5. Add data visualization
6. Implement real-time notifications

---

**Built with ❤️ for financial education in India**
#   F i n o r a _ f i n t e c h  
 