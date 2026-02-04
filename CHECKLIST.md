# FINORA - Setup Checklist

Use this checklist to set up and verify FINORA is working correctly.

## ✅ Pre-Installation

- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL installed (`psql --version`)
- [ ] Have Google Gemini API key ready
- [ ] Project folder exists at correct location

## ✅ Installation Steps

### 1. Dependencies
- [ ] Run `npm install`
- [ ] Wait for installation to complete (2-3 minutes)
- [ ] No error messages appear

### 2. Environment Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Update `DATABASE_URL` with PostgreSQL password
- [ ] Add `GEMINI_API_KEY` from Google AI Studio
- [ ] Generate random `JWT_SECRET` (min 32 characters)
- [ ] Save `.env` file

### 3. Database Setup
- [ ] PostgreSQL service is running
- [ ] Database `finora` created
- [ ] Run `npm run prisma:generate`
- [ ] Run `npm run prisma:migrate`
- [ ] Migrations completed successfully
- [ ] (Optional) Run `npm run prisma:seed`

### 4. Start Application
- [ ] Terminal 1: Run `npm run server:dev`
- [ ] Backend shows: "FINORA API server running on port 3001"
- [ ] Terminal 2: Run `npm run dev`
- [ ] Frontend shows: "Ready on http://localhost:3000"
- [ ] No error messages in either terminal

### 5. Verify Installation
- [ ] Open http://localhost:3000 in browser
- [ ] Login page appears
- [ ] Check http://localhost:3001/health
- [ ] Returns: `{"status":"ok","message":"FINORA API is running"}`

## ✅ Test User Flow

### Sign Up
- [ ] Click "Sign Up"
- [ ] Enter email and password (min 8 chars)
- [ ] Submit form
- [ ] Account created successfully
- [ ] Redirected to onboarding

### Onboarding
- [ ] Step 1: Select age range, category, language
- [ ] Click "Continue"
- [ ] Step 2: Enter income, expenses, savings
- [ ] Check "has emergency fund" if applicable
- [ ] Click "Continue"
- [ ] Step 3: Select financial goals
- [ ] Select risk level
- [ ] Click "Complete Setup"
- [ ] Redirected to dashboard

### Dashboard
- [ ] Dashboard loads successfully
- [ ] User email shown in header
- [ ] Feature cards visible
- [ ] Can navigate to different sections
- [ ] Logout button works

## ✅ Test API Endpoints

### Using PowerShell or Browser

```powershell
# Health Check
curl http://localhost:3001/health

# Sign Up (replace with your data)
curl -X POST http://localhost:3001/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'
```

- [ ] Health check returns OK
- [ ] Sign up creates user
- [ ] Login returns token
- [ ] Can access protected routes with token

## ✅ Verify Database

### Using Prisma Studio

```powershell
npm run prisma:studio
```

- [ ] Prisma Studio opens at http://localhost:5555
- [ ] User table contains your test user
- [ ] FinancialProfile table has your profile
- [ ] (If seeded) Scenario table has sample scenarios
- [ ] (If seeded) LearningPath table has sample paths

## ✅ Check Features

### Authentication
- [ ] Can sign up new users
- [ ] Can log in existing users
- [ ] Invalid credentials show error
- [ ] Token stored in browser
- [ ] Logout clears token
- [ ] Protected routes redirect to login

### Onboarding
- [ ] All 3 steps work
- [ ] Validation prevents empty fields
- [ ] Progress bar updates
- [ ] Can go back to previous steps
- [ ] Profile saved to database
- [ ] Redirects to dashboard after completion

### Dashboard
- [ ] Loads after onboarding
- [ ] Shows user email
- [ ] All feature cards visible
- [ ] Cards are clickable
- [ ] Navigation works
- [ ] Logout button works

### Languages
- [ ] Translation files exist for all 6 languages
- [ ] Can select language in onboarding
- [ ] (UI for language switching coming soon)

## ✅ Common Issues Resolution

### Port Already in Use
```powershell
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill the process (replace PID)
taskkill /PID <number> /F
```
- [ ] Ports freed up
- [ ] Can restart servers

### Database Connection Failed
```powershell
# Check PostgreSQL is running
Get-Service -Name postgresql*

# Test connection
psql -U postgres -d finora
```
- [ ] PostgreSQL service running
- [ ] Can connect to database
- [ ] DATABASE_URL is correct in .env

### Prisma Client Not Generated
```powershell
npm run prisma:generate
```
- [ ] Client generated successfully
- [ ] No errors shown

### Module Not Found
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```
- [ ] node_modules deleted
- [ ] Reinstalled successfully
- [ ] Application starts without errors

## ✅ Documentation Review

- [ ] Read README.md for overview
- [ ] Review QUICKSTART.md for quick setup
- [ ] Check INSTALLATION.md for detailed steps
- [ ] Browse API_DOCUMENTATION.md for API reference
- [ ] Review FEATURES.md for what's complete vs planned
- [ ] Read PROJECT_SUMMARY.md for high-level understanding

## ✅ Code Review

### Frontend
- [ ] Check src/app/ for page structure
- [ ] Review src/components/ui/ for UI components
- [ ] Look at src/lib/api.ts for API client
- [ ] Check src/store/ for state management
- [ ] Review src/i18n/ for translations

### Backend
- [ ] Check server/index.js for server setup
- [ ] Review server/routes/ for API endpoints
- [ ] Look at server/services/gemini.js for AI integration
- [ ] Check server/middleware/auth.js for JWT handling
- [ ] Review prisma/schema.prisma for database structure

## ✅ Next Steps

### Immediate (Start Coding)
- [ ] Build Budget Planner UI
- [ ] Create Savings Strategies display
- [ ] Implement Scenarios interface
- [ ] Build Learning Paths viewer

### Short Term (Enhance)
- [ ] Add data visualization
- [ ] Create profile settings page
- [ ] Add more scenarios
- [ ] Expand learning content

### Long Term (Scale)
- [ ] Mobile app development
- [ ] Add more languages
- [ ] Performance optimization
- [ ] Production deployment

## ✅ Production Readiness

Before deploying to production:

### Security
- [ ] Change JWT_SECRET to strong random value
- [ ] Set up rate limiting
- [ ] Add CSRF protection
- [ ] Implement email verification
- [ ] Add password reset flow

### Infrastructure
- [ ] Set up production PostgreSQL
- [ ] Configure environment variables
- [ ] Set up SSL/HTTPS
- [ ] Configure proper CORS
- [ ] Set up monitoring

### Testing
- [ ] Write unit tests
- [ ] Add integration tests
- [ ] Perform load testing
- [ ] Security audit
- [ ] User acceptance testing

### Deployment
- [ ] Build optimized production bundle
- [ ] Set up CI/CD pipeline
- [ ] Configure backup strategy
- [ ] Set up error tracking
- [ ] Configure CDN

## 📊 Success Indicators

You know everything is working when:

✅ Frontend runs at http://localhost:3000
✅ Backend runs at http://localhost:3001
✅ Can create new user accounts
✅ Can complete onboarding
✅ Dashboard loads successfully
✅ Can generate AI-powered savings strategies
✅ Database persists all data
✅ API endpoints respond correctly
✅ No console errors
✅ All tests pass

## 🎉 Completion

When all items above are checked:

✅ **FINORA is successfully set up!**

You now have:
- A fully functional fintech application
- Secure authentication system
- Multi-language support
- AI integration
- Complete backend API
- User-friendly onboarding
- Extensible architecture

**Ready to build amazing financial education experiences!**

---

**Last Updated:** February 4, 2026
**Status:** Ready for Development
