import { useState } from "react";
import Quiz from "./components/Quiz";
import AdminPanel from "./components/AdminPanel";
import "./App.css";
import { Button } from "react-bootstrap";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      {/* <Button
        variant="secondary"
        className="mb-3"
        onClick={() => setIsAdmin(!isAdmin)}
      >
        {isAdmin ? "Switch to User Mode" : "Switch to Admin Mode"}
      </Button> */}
      {isAdmin ? <AdminPanel /> : <Quiz />}
    </div>
  );
}

export default App;
