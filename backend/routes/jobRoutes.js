import express from "express";
import JobController from '../controllers/jobController.js';
const router = express.Router();

router.post('/', JobController.createJob);              // Create a new job
router.get('/user/:user_id', JobController.getJobsByUserId); // Get jobs by user ID

export default router;
