import express from 'express';
import prisma from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks (Admin sees all, Member sees assigned)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'ADMIN' ? {} : { assigneeId: req.user.id };
    const tasks = await prisma.task.findMany({
      where: query,
      include: {
        project: { select: { name: true } },
        assignee: { select: { name: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create task (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, status, dueDate, projectId, assigneeId } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Members can only update status if assigned to them, Admin can update anything
    if (req.user.role !== 'ADMIN' && task.assigneeId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, status, dueDate, assigneeId } = req.body;
    
    // Member updating logic - only status allowed usually, but let's just use what they send
    const updateData = req.user.role === 'ADMIN' ? {
      title, description, status, dueDate: dueDate ? new Date(dueDate) : null, assigneeId
    } : {
      status
    };

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData
    });
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete task (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
