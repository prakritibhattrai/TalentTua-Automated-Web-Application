import express from 'express';
import usersRoutes from './userRoutes';
import jobsRoutes from './jobRoutes';
import occupationRoutes from './occupationRoutes'

const router = express.Router();

router.use('/jobs', jobsRoutes);
router.use('/users', usersRoutes);
router.use('/occupations', occupationRoutes);

export default router;
