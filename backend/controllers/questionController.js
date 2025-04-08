import Question from '../models/Question.js';

export const uploadQuestions = async (req, res) => {
    try {
        const prevQuestions = await Question.find();
        if (prevQuestions.length > 0) {
            await Question.deleteMany();
        }
        const questions = await Question.insertMany(req.body.questions);
        res.status(201).json({ success: true, data: questions });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json({ success: true, data: questions });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};