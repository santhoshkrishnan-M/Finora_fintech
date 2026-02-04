const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const { generateFinancialStrategy } = require('../services/gemini');

const router = express.Router();

// Validation schema
const strategySchema = z.object({
  strategyType: z.enum(['SIP', 'SWP', 'RD', 'EMERGENCY_FUND']),
  monthlyAmount: z.number().positive().optional(),
  targetAmount: z.number().positive().optional(),
  duration: z.number().positive().optional(),
});

// Get user's savings strategies
router.get('/', authMiddleware, async (req, res) => {
  try {
    const strategies = await prisma.savingsStrategy.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(strategies);
  } catch (error) {
    console.error('Get strategies error:', error);
    res.status(500).json({ error: 'Failed to fetch strategies' });
  }
});

// Calculate emergency fund recommendation
function calculateEmergencyFund(monthlyExpenses) {
  // Recommended: 6 months of expenses
  const targetAmount = monthlyExpenses * 6;
  const recommendedMonthlySaving = monthlyExpenses * 0.2; // 20% of expenses
  const duration = Math.ceil(targetAmount / recommendedMonthlySaving);
  
  return {
    targetAmount,
    monthlyAmount: recommendedMonthlySaving,
    duration,
  };
}

// Generate new strategy with AI explanation
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { strategyType, monthlyAmount, targetAmount, duration, language = 'en' } = strategySchema.parse(req.body);

    // Get user profile
    const profile = await prisma.financialProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!profile) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    let finalMonthlyAmount = monthlyAmount;
    let finalTargetAmount = targetAmount;
    let finalDuration = duration;

    // Calculate emergency fund if requested
    if (strategyType === 'EMERGENCY_FUND' && !monthlyAmount) {
      const efCalc = calculateEmergencyFund(profile.monthlyExpenses);
      finalMonthlyAmount = efCalc.monthlyAmount;
      finalTargetAmount = efCalc.targetAmount;
      finalDuration = efCalc.duration;
    }

    // Generate AI explanation in user's language
    const explanation = await generateFinancialStrategy(profile, strategyType, {
      monthlyAmount: finalMonthlyAmount,
      targetAmount: finalTargetAmount,
      duration: finalDuration,
    }, language);

    // Save strategy
    const strategy = await prisma.savingsStrategy.create({
      data: {
        userId: req.userId,
        strategyType,
        monthlyAmount: finalMonthlyAmount,
        targetAmount: finalTargetAmount,
        duration: finalDuration,
        explanation,
        isActive: true,
      },
    });

    res.json({
      message: 'Strategy generated successfully',
      strategy,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Generate strategy error:', error);
    res.status(500).json({ error: 'Failed to generate strategy' });
  }
});

// Toggle strategy active status
router.patch('/:strategyId/toggle', authMiddleware, async (req, res) => {
  try {
    const { strategyId } = req.params;

    // Verify strategy belongs to user
    const strategy = await prisma.savingsStrategy.findUnique({
      where: { id: strategyId },
    });

    if (!strategy || strategy.userId !== req.userId) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    const updatedStrategy = await prisma.savingsStrategy.update({
      where: { id: strategyId },
      data: { isActive: !strategy.isActive },
    });

    res.json({
      message: 'Strategy updated successfully',
      strategy: updatedStrategy,
    });
  } catch (error) {
    console.error('Toggle strategy error:', error);
    res.status(500).json({ error: 'Failed to update strategy' });
  }
});

module.exports = router;
