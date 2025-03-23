require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");// Load environment variables

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: ["https://quizapp-one-cyan.vercel.app", "http://localhost:5173"], // Allow both production and local frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the Question schema
const QuestionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  moreInfo: String,
});

// Create the Question model
const Question = mongoose.model("Question", QuestionSchema);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Quiz App Backend!");
});

// Upload CSV data to DB
app.post("/api/upload", async (req, res) => {
  try {
    // await Question.deleteMany(); // Clear previous questions
    await Question.insertMany(req.body.questions);
    res.json({ message: "Questions uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));