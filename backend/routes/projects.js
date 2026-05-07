import express from 'express';
import prisma from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single project details with tasks
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: {
          include: { assignee: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create project (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await prisma.project.create({
      data: { name, description }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete project (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
