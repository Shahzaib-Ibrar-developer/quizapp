import React, { useState, useEffect } from "react";
import { Button, Spinner, Modal } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";
import "./Quiz.css"; // Ensure you create this file for styling

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Fetch questions from MongoDB
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://quizapp-backend-gold.vercel.app/api/questions"
      );
      setQuizData(response.data);
      setUserAnswers(new Array(response.data.length).fill(null));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    setLoading(false);
  };

  // Handle file upload (CSV/XLSX)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = async (e) => {
        Papa.parse(e.target.result, {
          complete: async (result) => {
            const formattedData = result.data
              .slice(1)
              .map(([question, answer, moreInfo]) => ({
                question,
                answer,
                moreInfo,
              }));

            await uploadQuestions(formattedData);
          },
          header: false,
        });
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx")) {
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const formattedData = jsonData
          .slice(1)
          .map(([question, answer, moreInfo]) => ({
            question,
            answer,
            moreInfo,
          }));

        await uploadQuestions(formattedData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Invalid file type! Please upload a CSV or XLSX file.");
      setLoading(false);
    }
  };

  // Upload questions to backend
  const uploadQuestions = async (formattedData) => {
    try {
      await axios.post("https://quizapp-backend-gold.vercel.app/api/upload", {
        questions: formattedData,
      });
      fetchQuestions();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (showAnswer) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setShowAnswer(true);
    }
  };

  return (
    <div className="quiz-container">
      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" variant="primary" className="m-2" />
          <p className="loading-text">Loading quiz data, please wait...</p>
        </div>
      ) : quizData.length > 0 ? (
        <div className="quiz-card">
          <h3 className="onMobileHeading">Quiz Time!</h3>
          <div className="top-bar">
            <div className="upload-container">
              <label className="btn btn-primary">
                <FaUpload /> Upload File
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  hidden
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            <h3>Quiz Time!</h3>

            <Button
              className="btn btn-primary more-info-btn"
              onClick={() => setShowModal(true)}
            >
              More Info
            </Button>
          </div>

          <div className="question-container">
            <p className="fw-bold">{`Question ${currentIndex + 1} of ${
              quizData.length
            }`}</p>
            <p>{quizData[currentIndex].question}</p>
          </div>

          {showAnswer && (
            <div className="answer-container">
              <p className="fw-bold">Answer:</p>
              <p>{quizData[currentIndex].answer}</p>
            </div>
          )}

          <div className="navigation-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setCurrentIndex(currentIndex - 1);
                setShowAnswer(false);
              }}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={currentIndex === quizData.length - 1 && showAnswer}
            >
              {showAnswer ? "Next Question" : "Show Answer"}
            </button>
          </div>
        </div>
      ) : (
        <div className="no-questions">
          <h3>Quiz Time!</h3>
          <div className="upload-container">
            <label className="btn btn-primary">
              <FaUpload /> Upload File
              <input
                type="file"
                accept=".csv,.xlsx"
                hidden
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <p>No questions available. Upload a CSV/XLSX file.</p>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>More Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {quizData[currentIndex]?.moreInfo ||
              "No additional information available."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Quiz;
