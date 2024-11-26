import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "D:/react_final/src/apiservice"; // Ensure correct import path

const Loginuser = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username) {
      alert("Please enter a username.");
      return;
    }

    try {
      const existingUsers = await ApiService.getUsers();
      const userExists = existingUsers.data.some((user) => user.username === username);

      if (!userExists) {
        await ApiService.addUser({ username });
      }

      navigate("/quiz-list", { state: { username } });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border px-4 py-2 rounded mb-4 w-full"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default Loginuser;
