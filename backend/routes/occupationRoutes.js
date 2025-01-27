import express from 'express';
import OccupationController from '../controllers/occupationController.js';

const router = express.Router();

router.post('/', OccupationController.suggestJobAttributes);           // Create a new user
router.get('/', OccupationController.getOccupation);           // Create a new user
router.get('/jobTitles/:occupation_id', OccupationController.getjobTitleByOccupationId);           // Create a new user
router.post('/suggestJobAttributes', OccupationController.suggestJobAttributes);   // Get user by ID
router.get('/:occupation_id', OccupationController.getOccupData);          // Get all users

export default router;
