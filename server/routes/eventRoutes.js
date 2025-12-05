import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    attendEvent,
    leaveEvent
} from '../controllers/eventController.js';

const router = express.Router();

router.route('/')
    .get(protect, getEvents)
    .post(protect, createEvent);

router.route('/:id')
    .get(protect, getEvent)
    .put(protect, updateEvent)
    .delete(protect, deleteEvent);

router.route('/:id/attend')
    .post(protect, attendEvent)
    .delete(protect, leaveEvent);

export default router;
