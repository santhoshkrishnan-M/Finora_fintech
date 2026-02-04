require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const budgetRoutes = require('./routes/budget');
const savingsRoutes = require('./routes/savings');
const scenarioRoutes = require('./routes/scenarios');
const learningRoutes = require('./routes/learning');
const fridayRoutes = require('./routes/friday');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/friday', fridayRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FINORA API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`FINORA API server running on port ${PORT}`);
});
