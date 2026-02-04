# FINORA - Installation & Setup Instructions

Follow these steps to get FINORA running on your machine.

## Prerequisites

1. **Node.js**: Version 18 or higher
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **PostgreSQL**: Version 14 or higher
   - Download: https://www.postgresql.org/download/
   - Verify: `psql --version`

3. **Google Gemini API Key**
   - Get free key: https://makersuite.google.com/app/apikey

## Installation Steps

### 1. Install Dependencies

Open PowerShell in the project directory:

```powershell
cd "C:\Users\Mahalakshmi Mohan\OneDrive\Desktop\Finora"
npm install
```

This will install all required packages (may take 2-3 minutes).

### 2. Set Up PostgreSQL Database

#### Option A: Using psql command line
```powershell
# Open PostgreSQL shell
psql -U postgres

# Create database (in psql)
CREATE DATABASE finora;

# Exit
\q
```

#### Option B: Using pgAdmin
1. Open pgAdmin
2. Right-click on "Databases"
3. Create > Database
4. Name: `finora`
5. Click Save

### 3. Configure Environment Variables

```powershell
# Copy example file
Copy-Item .env.example .env

# Open .env in notepad
notepad .env
```

Update these values in `.env`:

```env
# Replace 'password' with your PostgreSQL password
DATABASE_URL="postgresql://postgres:password@localhost:5432/finora?schema=public"

# Generate a random secret (or use a password generator)
JWT_SECRET="your-random-secret-key-min-32-characters"

# Get from Google AI Studio
GEMINI_API_KEY="your-api-key-here"

# Keep these as is for development
NODE_ENV="development"
API_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 4. Initialize Database Schema

```powershell
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Seed sample data (optional but recommended)
npm run prisma:seed
```

You should see:
- "Migration applied successfully"
- "Seed data created successfully"

### 5. Start the Application

You need TWO terminal windows:

#### Terminal 1 - Backend API Server:
```powershell
npm run server:dev
```

You should see: "FINORA API server running on port 3001"

#### Terminal 2 - Frontend (Next.js):
```powershell
npm run dev
```

You should see: "Ready on http://localhost:3000"

### 6. Open in Browser

Navigate to: http://localhost:3000

## Verification Checklist

✅ Node.js installed (`node --version` shows v18+)
✅ PostgreSQL installed and running
✅ Database 'finora' created
✅ `.env` file configured with correct values
✅ Prisma migrations completed
✅ Backend server running on port 3001
✅ Frontend running on port 3000
✅ Can access http://localhost:3000

## First Time Usage

1. Click "Sign Up" on the login page
2. Create account:
   - Email: your-email@example.com
   - Password: minimum 8 characters

3. Complete Onboarding (3 steps):
   - Step 1: Age, Category, Language
   - Step 2: Income, Expenses, Savings
   - Step 3: Goals, Risk Level

4. You'll be redirected to Dashboard

5. Explore features:
   - Budget Planner (foundation ready)
   - Savings Strategies (AI-powered)
   - Learning Scenarios (sample data loaded)
   - Learning Paths (sample data loaded)

## Common Issues & Solutions

### Issue: "Port 3000 already in use"

**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Then restart
npm run dev
```

### Issue: "Cannot connect to database"

**Solutions:**
1. Check if PostgreSQL is running:
   ```powershell
   # Check service status
   Get-Service -Name postgresql*
   ```

2. Verify DATABASE_URL in `.env`:
   - Correct username (usually 'postgres')
   - Correct password
   - Correct database name ('finora')

3. Test connection:
   ```powershell
   psql -U postgres -d finora
   ```

### Issue: "Prisma Client not initialized"

**Solution:**
```powershell
npm run prisma:generate
```

### Issue: "Module not found"

**Solution:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: "Migration failed"

**Solution:**
```powershell
# Reset database
npx prisma migrate reset

# Reapply migrations
npm run prisma:migrate

# Reseed data
npm run prisma:seed
```

## Development Workflow

### Daily Development:
```powershell
# Terminal 1
npm run server:dev

# Terminal 2
npm run dev
```

### View Database:
```powershell
npm run prisma:studio
```
Opens at http://localhost:5555

### Reset Database:
```powershell
npx prisma migrate reset
npm run prisma:seed
```

### Check API Health:
Visit: http://localhost:3001/health
Should return: `{"status":"ok","message":"FINORA API is running"}`

## Project Structure Overview

```
finora/
├── server/              # Backend (Express.js)
│   ├── index.js        # Main server file
│   ├── routes/         # API endpoints
│   └── services/       # Business logic (Gemini AI)
├── src/
│   ├── app/            # Pages (Next.js App Router)
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utilities (API client)
│   ├── store/          # State management (Zustand)
│   └── i18n/           # Translations (6 languages)
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.js         # Sample data
└── .env                # Configuration
```

## Available Scripts

```powershell
# Frontend
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm start                # Start production server

# Backend
npm run server:dev       # Start Express dev server
npm run server           # Start Express production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open database GUI
npm run prisma:seed      # Load sample data

# Utilities
npm run lint             # Run ESLint
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@localhost:5432/finora |
| JWT_SECRET | Secret key for JWT tokens | random-32-char-string |
| JWT_EXPIRES_IN | Token expiry time | 7d |
| GEMINI_API_KEY | Google Gemini API key | AIza... |
| NODE_ENV | Environment mode | development/production |
| API_URL | Backend URL | http://localhost:3001 |
| NEXT_PUBLIC_API_URL | Frontend-accessible API URL | http://localhost:3001 |

## Testing the Application

### 1. Authentication Test
- Sign up with new email
- Login with credentials
- Verify JWT token stored

### 2. Onboarding Test
- Complete all 3 steps
- Verify profile saved
- Check redirect to dashboard

### 3. API Test
Visit: http://localhost:3001/health

### 4. Database Test
```powershell
npm run prisma:studio
```
Check Users, FinancialProfile tables

## Next Steps

After successful installation:

1. **Explore the Dashboard**: Navigate through different sections
2. **Test Onboarding Flow**: Create a new user and complete setup
3. **Generate Savings Strategy**: Test AI integration
4. **View Sample Scenarios**: See loaded sample data
5. **Check Learning Paths**: Explore educational content

## Getting Help

If you encounter issues:

1. Check this document for solutions
2. Review `README.md` for detailed documentation
3. Check inline code comments
4. Verify all environment variables are set correctly
5. Ensure PostgreSQL is running
6. Clear browser cache and restart servers

## Production Deployment Notes

Before deploying to production:

1. ✅ Change JWT_SECRET to strong random string
2. ✅ Set up production PostgreSQL database
3. ✅ Update environment variables
4. ✅ Run `npm run build`
5. ✅ Configure CORS for your domain
6. ✅ Set up SSL/HTTPS
7. ✅ Test all features thoroughly
8. ✅ Set up monitoring and logging

---

**Installation Complete! 🎉**

You now have a fully functional fintech application with:
- Secure authentication
- Multi-language support
- AI-powered financial guidance
- Real-time data persistence
- Production-ready architecture

Start building amazing financial education experiences!
