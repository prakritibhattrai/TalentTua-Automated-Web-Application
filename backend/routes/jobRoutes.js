import express from "express";
import JobController from '../controllers/jobController.js';
const router = express.Router();

router.post('/', JobController.suggestJobAttributes);
router.get('/user/:user_id', JobController.getJobsByUserId);
router.post('/saveJob', JobController.saveJob);

export default router;
