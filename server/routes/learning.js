const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get learning paths for user's category and language
router.get('/paths', authMiddleware, async (req, res) => {
  try {
    const profile = await prisma.financialProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!profile) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    const paths = await prisma.learningPath.findMany({
      where: {
        category: profile.userCategory,
        language: profile.language,
      },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // Get user's progress for each path
    const pathsWithProgress = await Promise.all(
      paths.map(async (path) => {
        const progress = await prisma.learningProgress.findUnique({
          where: {
            userId_pathId: {
              userId: req.userId,
              pathId: path.id,
            },
          },
        });

        return {
          ...path,
          userProgress: progress || null,
        };
      })
    );

    res.json(pathsWithProgress);
  } catch (error) {
    console.error('Get learning paths error:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
});

// Get specific learning path
router.get('/paths/:pathId', authMiddleware, async (req, res) => {
  try {
    const { pathId } = req.params;

    const path = await prisma.learningPath.findUnique({
      where: { id: pathId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Get user's progress
    const progress = await prisma.learningProgress.findUnique({
      where: {
        userId_pathId: {
          userId: req.userId,
          pathId,
        },
      },
    });

    res.json({
      ...path,
      userProgress: progress || null,
    });
  } catch (error) {
    console.error('Get learning path error:', error);
    res.status(500).json({ error: 'Failed to fetch learning path' });
  }
});

// Start or update progress
router.post('/progress', authMiddleware, async (req, res) => {
  try {
    const { pathId, moduleId, isCompleted } = req.body;

    const progress = await prisma.learningProgress.upsert({
      where: {
        userId_pathId: {
          userId: req.userId,
          pathId,
        },
      },
      update: {
        currentModule: moduleId,
        completedModules: isCompleted
          ? {
              push: moduleId,
            }
          : undefined,
        updatedAt: new Date(),
      },
      create: {
        userId: req.userId,
        pathId,
        currentModule: moduleId,
        completedModules: isCompleted ? [moduleId] : [],
        progress: 0,
      },
    });

    // Calculate progress percentage
    const path = await prisma.learningPath.findUnique({
      where: { id: pathId },
      include: { modules: true },
    });

    const totalModules = path.modules.length;
    const completedCount = progress.completedModules.length;
    const progressPercentage = (completedCount / totalModules) * 100;

    // Update progress percentage
    const updatedProgress = await prisma.learningProgress.update({
      where: { id: progress.id },
      data: { progress: progressPercentage },
    });

    res.json({
      message: 'Progress updated successfully',
      progress: updatedProgress,
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
