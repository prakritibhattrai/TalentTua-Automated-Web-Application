import express from 'express';
import OccupationController from '../controllers/occupationController.js';

const router = express.Router();

router.get('/', OccupationController.getOccupation);           // Create a new user
router.get('/jobTitles/:occupation_id', OccupationController.getjobTitleByOccupationId);           // Create a new user


export default router;
