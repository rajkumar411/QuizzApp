import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ApiService from "D:/react_final/src/apiservice"; // Ensure correct import path

const QuizListForTaker = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [userResults, setUserResults] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { username } = location.state; // Ensure username is passed in location.state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [quizzesResponse, resultsResponse] = await Promise.all([
          ApiService.getAllQuizzes(),
          ApiService.getUserResults(username),
        ]);

        setQuizzes(quizzesResponse.data);
        const results = resultsResponse.data.reduce((acc, result) => {
          acc[result.quizId] = result;
          return acc;
        }, {});
        setUserResults(results);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-center">Loading quizzes...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Quizzes</h1>
      <input
        type="text"
        placeholder="Search quizzes..."
        className="border px-4 py-2 rounded mb-4 w-full"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredQuizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes match your search.</p>
      ) : (
        <ul className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
            >
              <Link
                to={`/take-quiz/${quiz.id}`}
                state={{ username }}
                className="text-blue-500 font-medium"
              >
                {quiz.title}
              </Link>
              {userResults[quiz.id] ? (
                <span className="text-green-500">
                  Recent Score: {userResults[quiz.id].score}
                </span>
              ) : (
                <span className="text-red-500">Not Taken</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizListForTaker;
