# FINORA - Developer Guide

This guide helps you understand and extend FINORA's codebase.

## 🏗️ Architecture Overview

FINORA follows a modern full-stack architecture:

```
Client (Next.js) ←→ API (Express) ←→ Database (PostgreSQL)
                         ↓
                    AI Service (Gemini)
```

---

## 📁 Project Structure Explained

### `/server` - Backend API

```
server/
├── index.js              # Express app entry point
├── routes/               # API endpoint handlers
│   ├── auth.js          # POST /api/auth/signup, /login
│   ├── profile.js       # GET/POST /api/profile
│   ├── budget.js        # Budget CRUD operations
│   ├── savings.js       # Savings strategy management
│   ├── scenarios.js     # Learning scenarios
│   └── learning.js      # Learning paths
├── services/
│   └── gemini.js        # AI integration logic
├── middleware/
│   └── auth.js          # JWT verification
└── lib/
    └── prisma.js        # Prisma client instance
```

### `/src` - Frontend Application

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout with fonts, styles
│   ├── page.tsx         # Landing page (redirects)
│   ├── auth/
│   │   ├── login/       # Login form
│   │   └── signup/      # Registration form
│   ├── onboarding/      # 3-step wizard
│   ├── dashboard/       # Main navigation hub
│   └── [feature]/       # Feature pages
├── components/
│   └── ui/              # Reusable components
├── lib/
│   ├── api.ts           # Centralized API client
│   └── utils.ts         # Helper functions
├── store/
│   ├── authStore.ts     # Auth state (Zustand)
│   └── profileStore.ts  # Profile state
└── i18n/
    └── messages/        # Translation files
```

---

## 🔧 Key Technologies

### Next.js App Router
- File-based routing
- Server and client components
- Built-in optimization

### Prisma ORM
- Type-safe database access
- Auto-generated client
- Migration system

### Zustand
- Lightweight state management
- Persistence support
- Simple API

### Radix UI
- Accessible components
- Unstyled primitives
- Customizable with Tailwind

---

## 💻 Development Workflow

### Starting Development

```powershell
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run dev
```

### Making Changes

1. **Database Changes:**
   ```powershell
   # Edit prisma/schema.prisma
   # Then run:
   npm run prisma:migrate
   npm run prisma:generate
   ```

2. **Adding API Endpoints:**
   - Create route handler in `server/routes/`
   - Add to `server/index.js`
   - Update `src/lib/api.ts` client

3. **Adding Pages:**
   - Create folder in `src/app/`
   - Add `page.tsx` file
   - Component auto-routes

4. **Adding Translations:**
   - Update all files in `src/i18n/messages/`
   - Maintain consistent keys

---

## 🎨 Component Development

### Creating a New UI Component

```typescript
// src/components/ui/my-component.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "special"
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes",
          variant === "special" && "special-classes",
          className
        )}
        {...props}
      />
    )
  }
)
MyComponent.displayName = "MyComponent"

export { MyComponent }
```

### Using the Component

```typescript
import { MyComponent } from "@/components/ui/my-component"

export default function Page() {
  return <MyComponent variant="special">Content</MyComponent>
}
```

---

## 🗄️ Database Operations

### Adding a New Model

1. Edit `prisma/schema.prisma`:
```prisma
model NewFeature {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  data      String
  createdAt DateTime @default(now())
}
```

2. Update User model to add relation:
```prisma
model User {
  // ... existing fields
  newFeatures NewFeature[]
}
```

3. Create migration:
```powershell
npx prisma migrate dev --name add_new_feature
```

### Querying Data

```javascript
// In route handler
const items = await prisma.newFeature.findMany({
  where: { userId: req.userId },
  include: { user: true },
  orderBy: { createdAt: 'desc' }
})
```

---

## 🔌 API Development

### Creating a New Endpoint

```javascript
// server/routes/myfeature.js
const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation schema
const mySchema = z.object({
  field: z.string().min(1),
});

// GET endpoint
router.get('/', authMiddleware, async (req, res) => {
  try {
    const data = await prisma.myModel.findMany({
      where: { userId: req.userId }
    });
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// POST endpoint
router.post('/', authMiddleware, async (req, res) => {
  try {
    const validated = mySchema.parse(req.body);
    const item = await prisma.myModel.create({
      data: {
        ...validated,
        userId: req.userId
      }
    });
    res.json({ message: 'Created', item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create' });
  }
});

module.exports = router;
```

### Register Route

```javascript
// server/index.js
const myFeatureRoutes = require('./routes/myfeature');
app.use('/api/myfeature', myFeatureRoutes);
```

### Add Client Function

```typescript
// src/lib/api.ts
export const myFeatureApi = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/api/myfeature`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },

  create: async (token: string, data: any) => {
    const response = await fetch(`${API_URL}/api/myfeature`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};
```

---

## 🤖 AI Integration

### Using Gemini API

```javascript
// server/services/gemini.js
async function generateContent(userProfile, context) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are a financial advisor for FINORA.

User Profile:
- Category: ${userProfile.userCategory}
- Income: ₹${userProfile.monthlyIncome}

Task: [Your specific instruction]

Guidelines:
- Use simple language
- Be educational
- No predictions
- No product recommendations
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
```

### Best Practices

1. **Always include user context** - Category, income, goals
2. **Be specific in prompts** - Clear instructions
3. **Handle errors** - Gemini API can fail
4. **Limit output** - Ask for concise responses
5. **Validate output** - Check for appropriate content

---

## 🌍 Adding Translations

### Update All Language Files

```json
// src/i18n/messages/en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Description here",
    "button": "Click Me"
  }
}

// src/i18n/messages/ta.json
{
  "myFeature": {
    "title": "என் அம்சம்",
    "description": "விளக்கம் இங்கே",
    "button": "என்னை கிளிக் செய்க"
  }
}
```

### Use in Components

```typescript
import { useTranslations } from 'next-intl';

export default function MyFeature() {
  const t = useTranslations('myFeature');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button>{t('button')}</button>
    </div>
  );
}
```

---

## 🎯 State Management

### Creating a New Store

```typescript
// src/store/myStore.ts
import { create } from 'zustand';

interface MyState {
  items: any[];
  setItems: (items: any[]) => void;
  addItem: (item: any) => void;
}

export const useMyStore = create<MyState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
}));
```

### Using the Store

```typescript
import { useMyStore } from '@/store/myStore';

export default function Component() {
  const { items, addItem } = useMyStore();

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      <button onClick={() => addItem({ id: 1, name: 'New' })}>
        Add
      </button>
    </div>
  );
}
```

---

## 🧪 Testing Strategies

### Manual Testing

1. **API Testing with cURL:**
```powershell
curl http://localhost:3001/api/endpoint -H "Authorization: Bearer TOKEN"
```

2. **Database Inspection:**
```powershell
npm run prisma:studio
```

3. **Browser DevTools:**
- Network tab for API calls
- Console for errors
- Application tab for storage

### Future: Automated Testing

```typescript
// Example unit test (to be added)
import { calculateEmergencyFund } from './utils';

test('calculates 6 months expenses', () => {
  expect(calculateEmergencyFund(10000)).toBe(60000);
});
```

---

## 🐛 Debugging Tips

### Backend Issues

```javascript
// Add logging
console.log('Request body:', req.body);
console.log('User ID:', req.userId);

// Check Prisma queries
const result = await prisma.model.findMany();
console.log('Query result:', result);
```

### Frontend Issues

```typescript
// Add console logs
console.log('State:', items);
console.log('API response:', data);

// Use React DevTools
// Check component props and state
```

### Database Issues

```powershell
# View database
npm run prisma:studio

# Check migrations
npx prisma migrate status

# Reset database
npx prisma migrate reset
```

---

## 📦 Adding New Dependencies

### Backend

```powershell
npm install package-name
# Then restart server
```

### Frontend

```powershell
npm install package-name
# Then restart dev server
```

### Update TypeScript Types

```powershell
npm install --save-dev @types/package-name
```

---

## 🚀 Performance Optimization

### Frontend

```typescript
// Use dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
});

// Memoize expensive calculations
const result = useMemo(() => expensiveCalc(data), [data]);

// Prevent unnecessary renders
const MemoizedComponent = React.memo(Component);
```

### Backend

```javascript
// Add database indexes
// In schema.prisma:
@@index([userId, createdAt])

// Use select to limit fields
const users = await prisma.user.findMany({
  select: { id: true, email: true }
});
```

---

## 🔒 Security Best Practices

### Never Do This

```javascript
// ❌ Don't expose secrets
console.log(process.env.JWT_SECRET);

// ❌ Don't trust user input
const query = `SELECT * FROM users WHERE id = ${req.params.id}`;

// ❌ Don't store passwords in plain text
await prisma.user.create({ data: { password: req.body.password } });
```

### Always Do This

```javascript
// ✅ Validate input
const validated = schema.parse(req.body);

// ✅ Use Prisma for queries
await prisma.user.findUnique({ where: { id: req.params.id } });

// ✅ Hash passwords
const hashed = await bcrypt.hash(password, 10);
```

---

## 📖 Code Style Guide

### TypeScript/JavaScript

```typescript
// Use descriptive names
const userFinancialProfile = await getUserProfile(userId);

// Add types
function calculateTotal(amount: number, tax: number): number {
  return amount + tax;
}

// Use async/await over promises
const data = await fetchData();

// Handle errors
try {
  await operation();
} catch (error) {
  console.error('Operation failed:', error);
  // Handle appropriately
}
```

### React Components

```typescript
// Use functional components
export default function MyComponent({ prop }: Props) {
  // Hooks at top
  const [state, setState] = useState();
  const something = useSomething();
  
  // Event handlers
  const handleClick = () => {
    // logic
  };
  
  // Render
  return <div onClick={handleClick}>Content</div>;
}
```

---

## 🎓 Learning Resources

### Next.js
- https://nextjs.org/docs

### Prisma
- https://www.prisma.io/docs

### Tailwind CSS
- https://tailwindcss.com/docs

### Zustand
- https://github.com/pmndrs/zustand

### Google Gemini
- https://ai.google.dev/docs

---

## 🤝 Contributing Guidelines

1. **Before coding:**
   - Understand the feature
   - Check existing code patterns
   - Plan database changes

2. **While coding:**
   - Follow existing patterns
   - Add comments for complex logic
   - Test thoroughly

3. **After coding:**
   - Update documentation
   - Test all edge cases
   - Check for errors

---

## 📞 Getting Help

1. Check inline code comments
2. Review API_DOCUMENTATION.md
3. Look at existing similar features
4. Test with Prisma Studio
5. Use console.log debugging

---

**Happy Coding! 🎉**

Build amazing financial education features!
