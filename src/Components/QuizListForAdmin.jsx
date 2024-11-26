import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiService from "D:/react_final/src/apiservice";

const QuizListForAdmin = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getAllQuizzes();
        setQuizzes(response.data);
      } catch (err) {
        setError("Failed to load quizzes. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );
    if (!confirmDelete) return;

    try {
      await ApiService.deleteQuiz(id);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
    } catch (err) {
      alert("Failed to delete the quiz. Please try again later.");
      console.error(err);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-center">Loading quizzes...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Quizzes</h1>
      <input
        type="text"
        placeholder="Search quizzes..."
        className="border px-4 py-2 rounded mb-4 w-full"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredQuizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
            >
              <span className="font-medium">{quiz.title}</span>
              <div>
                <Link
                  to={`/admin/edit-quiz/${quiz.id}`}
                  className="text-blue-500 mr-4 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizListForAdmin;
