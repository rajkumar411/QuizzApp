import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ isAuthenticated, setIsAuthenticated, isAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false); // Set authentication state to false
    navigate("/"); // Redirect to home page ("/")
  };

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quizz</h1>
        <nav>
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <Link to="/admin" className="mx-2">
                    Dashboard
                  </Link>
                  <Link to="/admin/quizzes" className="mx-2">
                    Manage Quizzes
                  </Link>
                  <Link to="/admin/add-quiz" className="mx-2">
                    Add Quiz
                  </Link>
                </>
              ) : (<></>)}
              
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded text-white ml-4"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="mx-2">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
