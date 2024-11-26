import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ApiService from "D:/react_final/src/apiservice"; // Ensure correct import path

const TestTaking = () => {
  const { quizId } = useParams(); // Get quizId from URL params
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {}; // Assume username is passed in location state
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(300); // Timer in seconds (5 minutes)
  const [quizCompleted, setQuizCompleted] = useState(false); // Track quiz completion status

  // Check if quiz is already completed (coming from results page)
  useEffect(() => {
    if (location.state?.completed) {
      setQuizCompleted(true); // If quiz is completed, do not start it again
      navigate(`/results/${quizId}`, { state: { username } }); // Redirect to results page
    }
  }, [location.state, quizId, navigate, username]);

  // Fetch quiz data when component mounts
  useEffect(() => {
    if (quizId && !quizCompleted) {
      ApiService.getQuizById(quizId)
        .then((response) => {
          setQuiz(response.data);
        })
        .catch((error) => {
          console.error("Error fetching quiz:", error);
        });
    }
  }, [quizId, quizCompleted]);

  // Timer countdown
  useEffect(() => {
    if (!quizCompleted) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(interval);
            handleSubmit(); // Auto-submit when time runs out
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quizCompleted]);

  // Handle answer selection
  const handleAnswerSelect = (index) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: index + 1, // Store as 1-based index
    }));
  };

  // Handle Save
  const handleSave = () => {
    if (selectedAnswers[currentQuestionIndex] === undefined) {
      alert("Please select an answer before saving.");
      return;
    }
    alert("Answer saved!");
  };

  // Handle Next
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1); // Move to next question
    } else {
      handleSubmit(); // Submit the test if it's the last question
    }
  };

  // Calculate score based on selected answers (1-based index)
  const calculateScore = () => {
    if (!quiz || !quiz.questions) return 0;

    return quiz.questions.reduce((score, question, index) => {
      const selectedAnswer = selectedAnswers[index]; // `selectedAnswers` is 1-based
      if (selectedAnswer === question.correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  // Handle Submit
  const handleSubmit = () => {
    const score = calculateScore();
    const formattedAnswers = Object.values(selectedAnswers);

    alert(`Test submitted! Your score is ${score}/${quiz.questions.length}`);

    ApiService.submitQuiz(parseInt(quizId), username, formattedAnswers, score)
      .then(() => {
        setQuizCompleted(true);
        navigate(`/results/${quizId}`, { state: { quiz, formattedAnswers, score, username } });
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error);
      });
  };

  // Format timer to show minutes and seconds
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Check if quiz data or questions are undefined before rendering
  if (!quiz || !quiz.questions) {
    return <p>Loading quiz...</p>; // Show loading message until quiz data is available
  }

  // Get current question
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{quiz.title}</h2>
        <div className="bg-red-500 text-white px-4 py-2 rounded">
          Time Remaining: {formatTimer()}
        </div>
      </div>

      {/* Question Display */}
      <div className="border p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </h3>
        <p className="mb-4">{currentQuestion.text}</p>

        {/* Answer Options */}
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`block w-full text-left p-2 border rounded ${
                selectedAnswers[currentQuestionIndex] === index + 1
                  ? "bg-blue-200"
                  : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={handleNext}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? "Next" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default TestTaking;
