import Quiz from "./components/Quiz";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import "./index.css";

function App() {
  return (
    // <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
    //
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/admin" element={<AdminPanel />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
