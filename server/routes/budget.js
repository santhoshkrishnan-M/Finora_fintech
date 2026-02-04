const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const budgetSchema = z.object({
  month: z.string(),
  year: z.number(),
  totalIncome: z.number().positive(),
  categories: z.array(z.object({
    name: z.string(),
    planned: z.number().min(0),
    actual: z.number().min(0).optional(),
  })),
});

// Get budget for a specific month
router.get('/:year/:month', authMiddleware, async (req, res) => {
  try {
    const { year, month } = req.params;

    const budget = await prisma.budget.findUnique({
      where: {
        userId_month_year: {
          userId: req.userId,
          month,
          year: parseInt(year),
        },
      },
      include: {
        categories: true,
      },
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

// Create or update budget
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { month, year, totalIncome, categories } = budgetSchema.parse(req.body);

    // Delete existing budget and categories
    await prisma.budget.deleteMany({
      where: {
        userId: req.userId,
        month,
        year,
      },
    });

    // Create new budget with categories
    const budget = await prisma.budget.create({
      data: {
        userId: req.userId,
        month,
        year,
        totalIncome,
        categories: {
          create: categories,
        },
      },
      include: {
        categories: true,
      },
    });

    res.json({
      message: 'Budget saved successfully',
      budget,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Save budget error:', error);
    res.status(500).json({ error: 'Failed to save budget' });
  }
});

// Update category actual amount
router.patch('/category/:categoryId', authMiddleware, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { actual } = req.body;

    // Verify category belongs to user's budget
    const category = await prisma.budgetCategory.findUnique({
      where: { id: categoryId },
      include: {
        budget: true,
      },
    });

    if (!category || category.budget.userId !== req.userId) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedCategory = await prisma.budgetCategory.update({
      where: { id: categoryId },
      data: { actual: parseFloat(actual) },
    });

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

module.exports = router;
