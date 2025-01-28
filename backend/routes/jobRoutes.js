import express from "express";
import JobController from '../controllers/jobController.js';
const router = express.Router();

router.post('/', JobController.suggestJobAttributes);
router.post('/saveJob', JobController.saveJob);

export default router;
