const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation schema
const profileSchema = z.object({
  ageRange: z.string(),
  userCategory: z.enum(['student', 'farmer', 'woman', 'professional']),
  language: z.enum(['en', 'ta', 'hi', 'te', 'ml', 'kn']),
  monthlyIncome: z.number().positive(),
  monthlyExpenses: z.number().positive(),
  financialGoals: z.array(z.string()),
  riskComfortLevel: z.enum(['low', 'medium', 'high']),
  hasEmergencyFund: z.boolean(),
  currentSavings: z.number().min(0),
});

// Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const profile = await prisma.financialProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Convert financialGoals back to array for response
    const profileResponse = {
      ...profile,
      financialGoals: profile.financialGoals 
        ? profile.financialGoals.split(',') 
        : [],
    };

    res.json(profileResponse);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create or update profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = profileSchema.parse(req.body);

    // Convert financialGoals array to comma-separated string for SQLite
    const profileData = {
      ...data,
      financialGoals: Array.isArray(data.financialGoals) 
        ? data.financialGoals.join(',') 
        : data.financialGoals,
    };

    const profile = await prisma.financialProfile.upsert({
      where: { userId: req.userId },
      update: profileData,
      create: {
        ...profileData,
        userId: req.userId,
      },
    });

    // Update user's hasProfile flag
    await prisma.user.update({
      where: { id: req.userId },
      data: { hasProfile: true },
    });

    // Convert financialGoals back to array for response
    const profileResponse = {
      ...profile,
      financialGoals: profile.financialGoals 
        ? profile.financialGoals.split(',') 
        : [],
    };

    res.json({
      message: 'Profile saved successfully',
      profile: profileResponse,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Save profile error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Update language preference
router.patch('/language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.body;
    
    if (!['en', 'ta', 'hi', 'te', 'ml', 'kn'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    const profile = await prisma.financialProfile.update({
      where: { userId: req.userId },
      data: { language },
    });

    res.json({ message: 'Language updated', language: profile.language });
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({ error: 'Failed to update language' });
  }
});

module.exports = router;
