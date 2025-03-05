import React from "react";
import "./Quiz.css";

const Result = ({ userAnswers, quizData, restartQuiz, overallRating }) => {
  let score = userAnswers.filter(
    (ans, index) => ans === quizData[index].answer
  ).length;

  return (
    <div className="result-container text-center">
      <img
        src="https://png.pngtree.com/png-clipart/20220910/original/pngtree-quiz-time-png-image_8530811.png"
        alt="Success"
        className="success-img"
      />
      {/* Overall Quiz Rating */}
      <div className="mb-3">
        <p>Rate the overall quiz:</p>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${overallRating >= star ? "filled" : ""}`}
            onClick={() => handleOverallRating(star)}
          >
            ⭐
          </span>
        ))}
      </div>

      <h4 className="text-success fw-bold mt-3">Quiz Completed!</h4>
      <p className="fw-bold">
        Your Score:{" "}
        <span className="text-primary">
          {score} / {quizData.length}
        </span>
      </p>

      <div className="text-start">
        {quizData.map((q, index) => (
          <p key={index}>
            <strong>Q{index + 1}:</strong> {q.question} <br />
            Your Answer:{" "}
            <span
              className={
                userAnswers[index] === q.answer ? "text-success" : "text-danger"
              }
            >
              {userAnswers[index] || "No Answer"}
            </span>{" "}
            <br />
            Correct Answer: <span className="text-primary">{q.answer}</span>
            <hr />
          </p>
        ))}
      </div>
      <button className="btn btn-outline-primary mt-3" onClick={restartQuiz}>
        Try Again
      </button>
    </div>
  );
};

export default Result;
