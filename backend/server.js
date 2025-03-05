const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

mongoose.connect(
  "mongodb+srv://hashir8malil:QPJVfBJOiMVczdLS@cluster0.d5ped.mongodb.net/quiz?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const QuestionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  moreInfo: String,
});

const Question = mongoose.model("Question", QuestionSchema);

// Upload CSV data to DB
app.post("/upload", async (req, res) => {
  try {
    await Question.deleteMany(); // Clear previous questions
    await Question.insertMany(req.body.questions);
    res.json({ message: "Questions uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all questions
app.get("/questions", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

app.listen(5000, () => console.log("Server running on port 5000"));
