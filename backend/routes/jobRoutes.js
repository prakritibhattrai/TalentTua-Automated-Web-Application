import express from "express";
import JobController from '../controllers/jobController.js';
const router = express.Router();

router.post('/', JobController.createJob);              // Create a new job
router.get('/user/:user_id', JobController.getJobsByUserId); // Get jobs by user ID
router.get('/industry/:industry', JobController.getJobsByIndustry); // Get jobs by industry

export default router;
