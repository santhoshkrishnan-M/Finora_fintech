const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const { generateScenarioFeedback } = require('../services/gemini');

const router = express.Router();

// Get scenarios for user's category and language
router.get('/', authMiddleware, async (req, res) => {
  try {
    const profile = await prisma.financialProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!profile) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    const scenarios = await prisma.scenario.findMany({
      where: {
        category: profile.userCategory,
        language: profile.language,
      },
      include: {
        options: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(scenarios);
  } catch (error) {
    console.error('Get scenarios error:', error);
    res.status(500).json({ error: 'Failed to fetch scenarios' });
  }
});

// Submit scenario attempt
router.post('/attempt', authMiddleware, async (req, res) => {
  try {
    const { scenarioId, selectedOptionId, language = 'en' } = req.body;

    // Get scenario with options
    const scenario = await prisma.scenario.findUnique({
      where: { id: scenarioId },
      include: { options: true },
    });

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    // Find selected option
    const selectedOption = scenario.options.find(opt => opt.id === selectedOptionId);

    if (!selectedOption) {
      return res.status(400).json({ error: 'Invalid option' });
    }

    // Get user profile
    const profile = await prisma.financialProfile.findUnique({
      where: { userId: req.userId },
    });

    // Generate AI feedback in user's language
    const feedback = await generateScenarioFeedback(
      profile,
      scenario,
      selectedOption,
      selectedOption.isCorrect,
      language
    );

    // Save attempt
    const attempt = await prisma.scenarioAttempt.create({
      data: {
        userId: req.userId,
        scenarioId,
        selectedOption: selectedOptionId,
        isCorrect: selectedOption.isCorrect,
        feedback,
      },
    });

    res.json({
      isCorrect: selectedOption.isCorrect,
      explanation: selectedOption.explanation,
      feedback,
      attempt,
    });
  } catch (error) {
    console.error('Submit attempt error:', error);
    res.status(500).json({ error: 'Failed to submit attempt' });
  }
});

// Get user's attempts history
router.get('/attempts', authMiddleware, async (req, res) => {
  try {
    const attempts = await prisma.scenarioAttempt.findMany({
      where: { userId: req.userId },
      include: {
        scenario: {
          select: {
            title: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json(attempts);
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

module.exports = router;
