import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "D:/react_final/src/apiservice";

const AddQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: ["", ""],
    correctAnswer: null, // 1-based index for the correct option
  });

  const navigate = useNavigate();

  // Handle Quiz Save
  const handleSaveQuiz = () => {
    if (!quizTitle || questions.length === 0) {
      alert("Quiz title and at least one question are required.");
      return;
    }
    const newQuiz = { title: quizTitle, questions };
    ApiService.addQuiz(newQuiz)
      .then(() => {
        alert("Quiz added successfully!");
        navigate("/admin");
      })
      .catch((error) => console.error("Error saving quiz:", error));
  };

  // Handle Question Save
  const handleSaveQuestion = () => {
    if (
      !currentQuestion.text.trim() ||
      currentQuestion.correctAnswer === null ||
      currentQuestion.correctAnswer < 1 ||
      currentQuestion.correctAnswer > currentQuestion.options.length
    ) {
      alert("Question text and a valid correct option are required.");
      return;
    }
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      text: "",
      options: ["", ""],
      correctAnswer: null,
    });
  };

  // Handle Adding Options
  const handleAddOption = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  // Handle Option Change
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Quiz</h2>

      {/* Quiz Title */}
      <div className="mb-4">
        <label className="block font-medium">Quiz Title</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Current Question */}
      <div className="mb-4">
        <label className="block font-medium">Add Question</label>
        <input
          type="text"
          value={currentQuestion.text}
          onChange={(e) =>
            setCurrentQuestion((prev) => ({ ...prev, text: e.target.value }))
          }
          className="border p-2 w-full rounded mb-2"
          placeholder="Enter question text"
        />
        <div>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="border p-2 flex-1 rounded mr-2"
                placeholder={`Option ${index + 1}`} // Display 1-based index
              />
              <input
                type="radio"
                name="correctOption"
                checked={currentQuestion.correctAnswer === index + 1} // Compare 1-based index
                onChange={() =>
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    correctAnswer: index + 1, // Store as 1-based index
                  }))
                }
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddOption}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Add Option
        </button>
      </div>

      {/* Save Question */}
      <button
        onClick={handleSaveQuestion}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2"
      >
        Save Question
      </button>

      {/* List of Questions */}
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Questions</h3>
        {questions.map((q, index) => (
          <div key={index} className="mb-2 border p-2 rounded">
            <p className="font-medium">{q.text}</p>
            <ul className="pl-4">
              {q.options.map((option, idx) => (
                <li
                  key={idx}
                  className={
                    idx + 1 === q.correctAnswer // Compare 1-based index
                      ? "font-bold text-green-500"
                      : ""
                  }
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Save Quiz */}
      <button
        onClick={handleSaveQuiz}
        className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded mt-4"
      >
        Save Quiz
      </button>
    </div>
  );
};

export default AddQuiz;
