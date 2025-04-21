require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { parse } = require("json2csv"); // Correct import for json2csv

const app = express();

// Enable CORS for frontend connection
app.use(
  cors({
    origin: ["https://quizapp-one-cyan.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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

// Define Schema for Questions
const QuestionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  moreInfo: String,
  setCode: String,         // Unique code for the set
  setName: String,         // Name of the set
  setDescription: String,  // Description of the set
  category: String,        // Main category
  subCategory1: String,    // First subcategory
  subCategory2: String,    // Second subcategory (if available)
  serialNumber: String,    // Unique serial number for reference
});

const Question = mongoose.model("Question", QuestionSchema);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Quiz App Backend!");
});

// Upload CSV data and organize into sets
app.post("/api/upload", async (req, res) => {
  try {
    if (!Array.isArray(req.body.questions) || req.body.questions.length === 0) {
      return res.status(400).json({ error: "Invalid or empty questions array" });
    }

    await Question.deleteMany(); // Clear existing questions
    await Question.insertMany(req.body.questions); // Insert new questions

    res.json({ message: "Questions uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/upload", async (req, res) => {
  try {
    const questions = req.body.questions;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Invalid or empty questions array" });
    }

    await Question.insertMany(questions); // Insert new data

    res.json({ message: "Admin questions replaced successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/replaced", async (req, res) => {
  try {
    const questions = req.body.questions;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Invalid or empty questions array" });
    }

    await Question.deleteMany();
    await Question.insertMany(questions);

    res.json({ message: "Admin questions uploaded and replaced successfully" });
  } catch (error) {
    console.error("Error replacing admin questions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all admin questions
app.get("/api/admin/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ setCode: 1, serialNumber: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export route to download admin questions as CSV
// app.get("/api/admin/export", async (req, res) => {
//   try {
//     const adminQuestions = await Question.find().lean();

//     if (!adminQuestions.length) {
//       return res.status(404).json({ error: "No admin questions to export" });
//     }

//     const csvData = parse(adminQuestions); // Use the parse function from json2csv
//     console.log("csvData", csvData);

//     // Set headers for file download
//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader("Content-Disposition", "attachment; filename=admin_questions.csv");

//     // Send the CSV file data
//     res.status(200).send(csvData);
//   } catch (error) {
//     console.error("Error generating CSV file:", error);
//     res.status(500).json({ error: error.message });
//   }
// });


app.get("/api/admin/export", async (req, res) => {
  try {
    const adminQuestions = await Question.find().lean();

    if (!adminQuestions.length) {
      return res.status(404).json({ error: "No admin questions to export" });
    }

    const fields = [
      "Question",
      "Answer",
      "More info",
      "Category",
      "Subcategory 1",
      "Subcategory 2",
      "Subcategory 3",
      "Subcategory 4",
      "Set",
      "Set Name (max 25 characters)",
      "Set Description (say 100 characters)",
      "Certainty (1)",
      "Serial"
    ];

    const formattedData = adminQuestions.map(q => ({
      "Question": q.question || "",
      "Answer": q.answer || "",
      "More info": q.moreInfo || "",
      "Category": q.category || "",
      "Subcategory 1": q.subCategory1 || "",
      "Subcategory 2": q.subCategory2 || "",
      "Subcategory 3": "", // Not available in your schema
      "Subcategory 4": "", // Not available in your schema
      "Set": q.setCode || "",
      "Set Name (max 25 characters)": q.setName || "",
      "Set Description (say 100 characters)": q.setDescription || "",
      "Certainty (1)": "", // You can fill this with static/default value if needed
      "Serial": q.serialNumber || ""
    }));

    const csvData = parse(formattedData, { fields });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=admin_questions.csv");

    res.status(200).send(csvData);
  } catch (error) {
    console.error("Error generating CSV file:", error);
    res.status(500).json({ error: error.message });
  }
});




// Fetch all questions (Grouped by sets)
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ setCode: 1, serialNumber: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch questions by set
app.get("/api/set/:setCode", async (req, res) => {
  try {
    const { setCode } = req.params;
    const setQuestions = await Question.find({ setCode });

    if (!setQuestions.length) {
      return res.status(404).json({ error: "Set not found" });
    }

    res.json(setQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recommended sets based on previous sets studied
app.get("/api/recommendations", async (req, res) => {
  try {
    const studiedSets = req.query.studiedSets?.split(",") || [];
    const favorites = req.query.favorites?.split(",") || [];

    let recommendedSets = await Question.aggregate([
      { $match: { setCode: { $nin: studiedSets } } },
      { $sample: { size: 5 } }, // Randomized recommendations
      {
        $group: {
          _id: "$setCode",
          setName: { $first: "$setName" },
          setDescription: { $first: "$setDescription" },
        },
      },
    ]);

    res.json(recommendedSets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
