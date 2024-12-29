import express from 'express';
import usersRoutes from './userRoutes';
import jobsRoutes from './jobRoutes';

const router = express.Router();

router.use('/jobs', jobsRoutes);
router.use('/users', usersRoutes);

export default router;
