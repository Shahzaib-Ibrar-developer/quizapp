import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    question: String,
    answer: String,
    moreInfo: String,
    setCode: String,
    setName: String,
    setDescription: String,
    category: String,
    subCategory1: String,
    subCategory2: String,
    serialNumber: String,
}, { timestamps: true });

export default mongoose.model('Question', QuestionSchema);