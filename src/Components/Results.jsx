import React from "react";
import { useLocation } from "react-router-dom";

const Results = () => {
  const { state } = useLocation();
  const { quiz, formattedAnswers } = state;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{quiz.title} - Results</h2>
      <p className="mb-4">
        <span className="font-semibold">Score:</span>{" "}
        {formattedAnswers.filter(
          (answer, index) => answer === quiz.questions[index].correctAnswer
        ).length}{" "}
        / {quiz.questions.length}
      </p>

      <div className="border p-4 rounded shadow-md">
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-6">
            <h3 className="font-semibold mb-2">{`Q${index + 1}: ${question.text}`}</h3>
            <ul className="pl-4">
              {question.options.map((option, idx) => (
                <li
                  key={idx}
                  className={`p-2 rounded ${
                    idx + 1 === question.correctAnswer
                      ? "bg-green-100 text-green-600 font-bold" // Correct answer
                      : idx + 1 === formattedAnswers[index]
                      ? "bg-red-100 text-red-600" // Incorrect answer
                      : "text-gray-800" // Neutral (not selected)
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
