import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const AdminPanel = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "What is 2+2?",
      options: ["2", "3", "4", "5"],
      answer: "4",
    },
    {
      id: 2,
      question: "Capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      answer: "Paris",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Handle Add/Edit
  const handleSave = () => {
    if (editingQuestion) {
      setQuestions(
        questions.map((q) => (q.id === editingQuestion.id ? newQuestion : q))
      );
    } else {
      setQuestions([...questions, { ...newQuestion, id: Date.now() }]);
    }
    setShowModal(false);
    setNewQuestion({ question: "", options: ["", "", "", ""], answer: "" });
    setEditingQuestion(null);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    setQuestions(questions.filter((q) => q.id !== deleteId));
    setShowConfirm(false);
    setDeleteId(null);
  };

  return (
    <div className="container mt-4" style={{ width: "900px" }}>
      <div className="bg-light p-4 rounded shadow">
        <h2 className="text-center text-primary mb-4">Admin Panel</h2>
        <div className="text-start">
          <Button
            variant="success"
            className="mb-3"
            onClick={() => setShowModal(true)}
          >
            Add Question
          </Button>
        </div>

        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr key={q.id}>
                <td>{index + 1}</td>
                <td>{q.question}</td>
                <td>{q.answer}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => {
                      setEditingQuestion(q);
                      setNewQuestion(q);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleDeleteConfirm(q.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Adding/Editing Questions */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuestion ? "Edit Question" : "Add Question"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, question: e.target.value })
                }
              />
            </Form.Group>
            {newQuestion.options.map((opt, i) => (
              <Form.Group key={i} className="mt-2">
                <Form.Label>Option {i + 1}</Form.Label>
                <Form.Control
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[i] = e.target.value;
                    setNewQuestion({ ...newQuestion, options: newOptions });
                  }}
                />
              </Form.Group>
            ))}
            <Form.Group className="mt-2">
              <Form.Label>Correct Answer</Form.Label>
              <Form.Control
                as="select"
                value={newQuestion.answer}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, answer: e.target.value })
                }
              >
                {newQuestion.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingQuestion ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this question?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;
