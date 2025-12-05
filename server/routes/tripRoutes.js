import express from 'express';
import {
    createTrip,
    getTrips,
    getTrip,
    inviteTraveler,
    addActivity,
    sendMessage,
    updateTrip,
    deleteTrip,
    updateActivity,
    deleteActivity,
    cancelInvite,
    updatePackingItem,
    deletePackingItem,
    generateTripPass,
    joinTripWithPass
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getTrips).post(protect, createTrip);
router.route('/:id').get(protect, getTrip).put(protect, updateTrip).delete(protect, deleteTrip);
router.route('/:id/invite').post(protect, inviteTraveler);
router.route('/:id/invite/:email').delete(protect, cancelInvite);
router.route('/:id/itinerary').post(protect, addActivity);
router.route('/:id/itinerary/:activityId').put(protect, updateActivity).delete(protect, deleteActivity);
router.route('/:id/chat').post(protect, sendMessage);
router.route('/:id/packing').put(protect, updatePackingItem);
router.route('/:id/packing/:itemId').delete(protect, deletePackingItem);
router.route('/:id/generate-pass').post(protect, generateTripPass);
router.route('/join/:passCode').post(protect, joinTripWithPass);

export default router;
