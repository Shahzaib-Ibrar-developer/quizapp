import React from 'react';
import Quiz from "./components/Quiz";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Quiz />} /> {/* Catch-all route */}
      </Routes>
    </Router>
  );
}

export default App;