import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Components/Login";
import QuizListForAdmin from "./Components/QuizListForAdmin";
import AddQuiz from "./Components/AddQuiz";
import EditQuiz from "./Components/EditQuiz";
import AdminDashboard from "./Components/Admindashboard";
import QuizListForTaker from "./Components/Quizlistfortaker";
import TestTaking from "./Components/TestTaking";
import Results from "./Components/Results";
import Loginuser from "./Components/Loginuser";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        isAdmin={isAdmin}
      />
      <Routes>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />}
        />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />
            )
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            isAdmin ? (
              <QuizListForAdmin />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />
            )
          }
        />
        <Route
          path="/admin/add-quiz"
          element={
            isAdmin ? (
              <AddQuiz />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />
            )
          }
        />
        <Route
          path="/admin/edit-quiz/:id"
          element={
            isAdmin ? (
              <EditQuiz />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />
            )
          }
        />
         <Route path="/loginuser" element={<Loginuser />} />
        <Route path="/quiz-list" element={<QuizListForTaker />} />
        <Route path="/take-quiz/:quizId" element={<TestTaking />} />
        <Route path="/results/:quizId" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;
