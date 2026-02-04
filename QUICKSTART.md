# FINORA - Quick Start Guide

Get FINORA running in 10 minutes!

## Step 1: Install PostgreSQL (if not installed)

### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember your postgres password

## Step 2: Set up the Project

Open PowerShell in the project directory:

```powershell
cd "C:\Users\Mahalakshmi Mohan\OneDrive\Desktop\Finora"

# Install dependencies
npm install

# Copy environment file
Copy-Item .env.example .env
```

## Step 3: Configure Environment

Edit `.env` file and update:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/finora?schema=public"
JWT_SECRET="change-this-to-a-random-secret-string"
GEMINI_API_KEY="get-from-google-ai-studio"
```

### Get Gemini API Key:
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste into `.env`

## Step 4: Create Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE finora;
\q
```

## Step 5: Run Migrations

```powershell
npm run prisma:generate
npm run prisma:migrate
```

## Step 6: Start the App

Open TWO PowerShell windows:

### Window 1 - Backend:
```powershell
npm run server:dev
```

### Window 2 - Frontend:
```powershell
npm run dev
```

## Step 7: Open in Browser

Navigate to: http://localhost:3000

## First Use:

1. Click "Sign Up"
2. Create account with email/password
3. Complete onboarding (3 steps)
4. Explore the dashboard!

## Troubleshooting

### "Port 3000 already in use"
```powershell
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Ensure database 'finora' exists

### "Prisma Client not generated"
```powershell
npm run prisma:generate
```

## Features to Try:

1. **Onboarding**: Multi-step profile setup
2. **Dashboard**: Navigate through features
3. **Budget**: (UI foundation ready)
4. **Savings**: Generate AI-powered strategies
5. **Scenarios**: (API ready, needs UI)
6. **Learning**: (API ready, needs UI)

## Development Commands:

```powershell
# Start frontend
npm run dev

# Start backend
npm run server:dev

# View database
npm run prisma:studio

# Reset database
npx prisma migrate reset
```

## What's Working:

✅ Authentication (Signup/Login)
✅ JWT token management
✅ Onboarding flow with validation
✅ User profile storage
✅ Dashboard navigation
✅ Multi-language support (6 languages)
✅ Database schema
✅ All API endpoints
✅ AI integration with Gemini
✅ State management with Zustand

## What Needs UI:

- Budget Planner interface
- Savings Strategies display
- Scenario simulator
- Learning paths viewer
- Profile settings editor

The backend API for all these features is complete and functional!

---

**Need help?** Check README.md for detailed documentation.
