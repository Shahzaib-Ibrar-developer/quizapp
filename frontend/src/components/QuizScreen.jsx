import React from "react";
import { Button, Card, Modal, Spinner } from "react-bootstrap";
import {
  FaHome,
  FaRandom,
  FaRegStar,
  FaStar,
  FaUpload,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const QuizScreen = ({
  currentSet,
  currentIndex,
  showAnswer,
  showSetInfo,
  favorites,
  recommendedSets,
  showModal,
  loading,
  onToggleFavorite,
  onToggleSetInfo,
  onShowModal,
  onHideModal,
  onPrevious,
  onNext,
  onReturnToMenu,
  onLoadSet,
  onLoadRandomSet,
  onFileUpload,
  renderCategoryPath,
}) => (
  <div className="quiz-container">
    {loading ? (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" className="m-2" />
        <p className="loading-text">Loading quiz data, please wait...</p>
      </div>
    ) : (
      <div className="quiz-card">
        {/* Top Bar with Set Info */}
        <div className="top-bar">
          <div className="upload-container">
            <label className="btn btn-primary">
              <FaUpload /> Upload File
              <input
                type="file"
                accept=".csv,.xlsx"
                hidden
                onChange={onFileUpload}
              />
            </label>
          </div>

          <div className="set-info">
            <h3>{currentSet?.setName || "No Set Loaded"}</h3>
            {currentSet && (
              <Button
                variant="link"
                onClick={onToggleSetInfo}
                className="set-info-toggle"
              >
                {showSetInfo ? "Hide Info" : "Show Info"}
              </Button>
            )}
          </div>

          <Button
            className="btn btn-primary more-info-btn"
            onClick={onShowModal}
          >
            More Info
          </Button>
        </div>

        {/* Set Details */}
        {showSetInfo && currentSet && (
          <div className="set-details">
            <p>
              <strong>Description:</strong> {currentSet.setDescription}
            </p>
            <p>
              <strong>Category:</strong> {renderCategoryPath()}
            </p>
            <p>
              <strong>Set Code:</strong> {currentSet.setCode}
            </p>
            <Button
              variant={
                favorites.includes(currentSet.setCode)
                  ? "warning"
                  : "outline-warning"
              }
              onClick={() => onToggleFavorite(currentSet.setCode)}
              size="sm"
            >
              {favorites.includes(currentSet.setCode) ? (
                <FaStar />
              ) : (
                <FaRegStar />
              )}
              {favorites.includes(currentSet.setCode)
                ? " Favorited"
                : " Add to Favorites"}
            </Button>
          </div>
        )}

        {/* Main Content Area */}
        {currentSet?.questions?.length > 0 ? (
          <>
            <div className="question-container">
              <p className="fw-bold">{`Question ${currentIndex + 1} of ${
                currentSet.questions.length
              }`}</p>
              <p>{currentSet.questions[currentIndex].question}</p>
              {currentSet.questions[currentIndex].serialNumber && (
                <small className="text-muted">
                  ID: {currentSet.questions[currentIndex].serialNumber}
                </small>
              )}
            </div>

            {showAnswer && (
              <div className="answer-container">
                <p className="fw-bold">Answer:</p>
                <p>{currentSet.questions[currentIndex].answer}</p>
              </div>
            )}
          </>
        ) : (
          <div className="no-questions-message">
            <h4>No Questions Available</h4>
            <p>Please upload a file or select a different set</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <Button
            variant="secondary"
            onClick={onPrevious}
            disabled={currentIndex === 0 || !currentSet?.questions?.length}
          >
            Previous
          </Button>

          <Button variant="outline-primary" onClick={onReturnToMenu}>
            <FaHome /> Main Menu
          </Button>

          <Button
            variant="primary"
            onClick={onNext}
            disabled={
              !currentSet?.questions?.length ||
              (currentIndex === currentSet.questions.length - 1 && showAnswer)
            }
          >
            {showAnswer ? "Next Question" : "Show Answer"}
          </Button>
        </div>

        {/* Recommended Sets */}
        {recommendedSets.length > 0 && (
          <div className="recommendations">
            <h5>Recommended Sets</h5>
            <div className="recommendation-list">
              {recommendedSets.map((set) => (
                <Card key={set._id} className="recommendation-card">
                  <Card.Body>
                    <Card.Title>{set.setName}</Card.Title>
                    <Card.Text>{set.setDescription}</Card.Text>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onLoadSet(set._id)}
                    >
                      Study This Set
                    </Button>
                  </Card.Body>
                </Card>
              ))}
              <Card className="recommendation-card random-card">
                <Card.Body>
                  <Card.Title>Random Set</Card.Title>
                  <Card.Text>Try a random set of questions</Card.Text>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={onLoadRandomSet}
                  >
                    <FaRandom /> Random
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={onHideModal}>
          <Modal.Header closeButton>
            <Modal.Title>More Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {currentSet?.questions?.[currentIndex]?.moreInfo ||
                "No additional information available."}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHideModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )}
  </div>
);

export default QuizScreen;
