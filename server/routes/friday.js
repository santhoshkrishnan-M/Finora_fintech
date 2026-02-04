const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const prisma = require('../lib/prisma');
const { generateSectionGuidance, generateFRIDAYResponse, generateStarterQuestions } = require('../services/gemini');

// Get section-specific AI guidance
router.post('/guidance', authenticateToken, async (req, res) => {
  try {
    const { sectionType, language } = req.body;
    const userId = req.userId;

    const profile = await prisma.financialProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const guidance = await generateSectionGuidance(profile, sectionType, language || 'en');

    res.json({ guidance });
  } catch (error) {
    console.error('Error generating guidance:', error);
    res.status(500).json({ error: 'Failed to generate guidance' });
  }
});

// FRIDAY chat endpoint
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, conversationHistory, language } = req.body;
    const userId = req.userId;

    const profile = await prisma.financialProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const response = await generateFRIDAYResponse(
      profile, 
      message, 
      conversationHistory || [], 
      language || 'en'
    );

    res.json({ response });
  } catch (error) {
    console.error('Error generating FRIDAY response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Get starter questions
router.get('/starter-questions', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const language = req.query.language || 'en';

    const profile = await prisma.financialProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const questions = await generateStarterQuestions(profile, language);

    res.json({ questions });
  } catch (error) {
    console.error('Error generating starter questions:', error);
    res.status(500).json({ error: 'Failed to generate starter questions' });
  }
});

module.exports = router;
