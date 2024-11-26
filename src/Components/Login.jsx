import React from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated, setIsAdmin }) => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setIsAuthenticated(true);
    setIsAdmin(role === "admin");
    navigate(role === "admin" ? "/admin" : "/loginuser");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4">Choose Your Role</h1>
        <div className="space-x-4">
          <button
            onClick={() => handleRoleSelection("admin")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Admin
          </button>
          <button
            onClick={() => handleRoleSelection("user")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Test Taker
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
