import React, { useState } from "react";
import Result from "./Result";
import "./Quiz.css";
import { Modal, Button } from "react-bootstrap";

const quizData = [
  { question: "What is 2+2?", options: ["2", "3", "4", "5"], answer: "4" },
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which is the largest ocean?",
    options: ["Atlantic", "Pacific", "Indian", "Arctic"],
    answer: "Pacific",
  },
  { question: "What is 5*3?", options: ["8", "12", "15", "20"], answer: "15" },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Hemingway", "Austen", "Tolkien"],
    answer: "Shakespeare",
  },
  {
    question: "What is the capital of Japan?",
    options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    answer: "Tokyo",
  },
  {
    question: "What is the boiling point of water?",
    options: ["50°C", "75°C", "100°C", "150°C"],
    answer: "100°C",
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mars", "Earth", "Mercury"],
    answer: "Mercury",
  },
  {
    question: "What is the square root of 64?",
    options: ["6", "7", "8", "9"],
    answer: "8",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
    answer: "Da Vinci",
  },
];

const Quiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    new Array(quizData.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);
  const [ratings, setRatings] = useState(new Array(quizData.length).fill(null));
  const [overallRating, setOverallRating] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleOptionChange = (event) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = event.target.value;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRatingChange = (rating) => {
    const newRatings = [...ratings];
    newRatings[currentIndex] = rating;
    setRatings(newRatings);
  };

  const handleOverallRating = (rating) => {
    setOverallRating(rating);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers(new Array(quizData.length).fill(null));
    setRatings(new Array(quizData.length).fill(null));
    setOverallRating(null);
    setShowResult(false);
  };

  return (
    <div className="quiz-container">
      <div className="d-flex justify-content-between">
        <h3 className="text-primary fw-bold">Quiz Time!</h3>
        <Button variant="info" onClick={() => setShowModal(true)}>
          More Info
        </Button>
      </div>

      {!showResult ? (
        <>
          <p className="fw-bold">{`Question ${currentIndex + 1} of ${
            quizData.length
          }`}</p>
          <p>{quizData[currentIndex].question}</p>
          <div>
            {quizData[currentIndex].options.map((option, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="option"
                  id={`option${index}`}
                  value={option}
                  checked={userAnswers[currentIndex] === option}
                  onChange={handleOptionChange}
                />
                <label className="form-check-label" htmlFor={`option${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>

          {/* Rating System for Individual Questions */}
          <div className="mt-3">
            <p>Rate this question:</p>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  ratings[currentIndex] >= star ? "filled" : ""
                }`}
                onClick={() => handleRatingChange(star)}
              >
                ⭐
              </span>
            ))}
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-secondary"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              {currentIndex < quizData.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
        </>
      ) : (
        <Result
          userAnswers={userAnswers}
          quizData={quizData}
          restartQuiz={restartQuiz}
          overallRating={overallRating}
          handleOverallRating={handleOverallRating}
        />
      )}

      {/* Modal for More Info */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>More Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Adolf Hitler’s invasion of Poland on 1 September 1939 marked the
            start of World War II. Using the Blitzkrieg strategy, Germany
            launched a swift and overwhelming attack, combining tanks, infantry,
            and air support to quickly overpower Polish defenses.
          </p>
          <p>
            For more details, check:{" "}
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Quiz;
