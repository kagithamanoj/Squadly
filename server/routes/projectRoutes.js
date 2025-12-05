import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addMember,
    removeMember
} from '../controllers/projectController.js';

const router = express.Router();

router.route('/')
    .get(protect, getProjects)
    .post(protect, createProject);

router.route('/:id')
    .get(protect, getProject)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

router.route('/:id/tasks')
    .post(protect, addTask);

router.route('/:id/tasks/:taskId')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

router.route('/:id/members')
    .post(protect, addMember);

router.route('/:id/members/:userId')
    .delete(protect, removeMember);

export default router;
