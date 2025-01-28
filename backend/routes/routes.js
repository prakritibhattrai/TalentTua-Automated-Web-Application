import express from 'express';
import usersRoutes from './userRoutes';
import jobsRoutes from './jobRoutes';
import occupationRoutes from './occupationRoutes'

const router = express.Router();

router.use('/jobs', jobsRoutes);
router.use('/users', usersRoutes);
router.use('/occupations', occupationRoutes);
// Optionally, add a 404 handler for unrecognized routes (better UX for production)
router.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
export default router;
