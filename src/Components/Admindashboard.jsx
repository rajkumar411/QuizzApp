import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiService from "D:/react_final/src/apiservice";

const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch results and quizzes on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultsData = await ApiService.getAllResults();
        const quizzesData = await ApiService.getAllQuizzes();
        setResults(resultsData.data || []);
        setQuizzes(quizzesData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle viewing details of the selected test taker
  const handleViewMore = (result) => {
    setSelectedResult(result);
    setShowDetails(true);
  };

  // Get quiz title by quizId
  const getQuizTitle = (quizId) => {
    if (!quizzes || !Array.isArray(quizzes)) return "Unknown Quiz";

    const quiz = quizzes.find((quiz) => quiz.id.toString() === quizId.toString());
    return quiz ? quiz.title : "Unknown Quiz";
  };

  // Get correct answers for a quiz by quizId
  const getCorrectAnswers = (quizId) => {
    const quiz = quizzes.find((quiz) => quiz.id.toString() === quizId.toString());
    return quiz ? quiz.questions.map((q) => q.correctAnswer) : [];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>
      <div className="flex justify-center mb-6">
        <Link
          to="/admin/add-quiz"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Quiz
        </Link>
      </div>

      {!showDetails ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Test Takers</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">  
                <th className="border border-gray-300 px-4 py-2">Username</th>
                <th className="border border-gray-300 px-4 py-2">Quiz Title</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((result, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {result.username}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {getQuizTitle(result.quizId)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {result.score}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleViewMore(result)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setShowDetails(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded mb-4 hover:bg-gray-600"
          >
            Back to List
          </button>
          <h2 className="text-xl font-bold mb-4">Quiz Details</h2>
          <h3 className="text-lg font-bold mb-2">
            Quiz Title: {getQuizTitle(selectedResult.quizId)}
          </h3>
          <h3 className="text-lg font-bold mb-2">
            Username: {selectedResult.username}
          </h3>
          <h3 className="text-lg font-bold mb-4">
            Score: {selectedResult.score}
          </h3>

          {/* Render Questions and Answers */}
          <ul>
            {quizzes
              .find((quiz) => quiz.id.toString() === selectedResult.quizId.toString())
              ?.questions.map((q, index) => {
                const correctAnswers = getCorrectAnswers(selectedResult.quizId);
                const userAnswer = selectedResult.answers[index];
                const isCorrect = userAnswer === correctAnswers[index];

                return (
                  <li
                    key={index}
                    className={`p-4 mb-2 rounded ${
                      isCorrect
                        ? "bg-green-100 border-l-4 border-green-500"
                        : "bg-red-100 border-l-4 border-red-500"
                    }`}
                  >
                    <p className="font-bold">{q.text}</p>
                    <ul>
                      {q.options.map((opt, optIndex) => {
                        const optionClass =
                          optIndex + 1 === correctAnswers[index]
                            ? "text-green-500"
                            : optIndex + 1 === userAnswer
                            ? "text-red-500"
                            : "text-gray-500";

                        return (
                          <li key={optIndex} className={`pl-4 ${optionClass}`}>
                            {optIndex + 1}. {opt}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
