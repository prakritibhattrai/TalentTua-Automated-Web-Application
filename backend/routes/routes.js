import express from 'express';
import usersRoutes from './users';
import jobsRoutes from './jobs';

const router = express.Router();

router.use('/jobs', jobsRoutes);
router.use('/users', usersRoutes);

export default router;
