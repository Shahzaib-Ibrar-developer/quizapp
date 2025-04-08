import express from 'express';
import { uploadQuestions, getQuestions } from '../controllers/questionController.js';

const router = express.Router();

router.post('/upload', uploadQuestions);
router.get('/', getQuestions);

export default router;