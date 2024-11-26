import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "D:/react_final/src/apiservice";

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({ title: "", questions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getQuizById(id);
        const updatedQuiz = {
          ...response.data,
          questions: response.data.questions.map((q) => ({
            ...q,
            correctAnswer: q.correctAnswer + 1, // Convert 0-based index to 1-based
          })),
        };
        setQuiz(updatedQuiz);
      } catch (err) {
        setError("Failed to load the quiz. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSaveQuiz = async () => {
    if (!quiz.title.trim()) {
      alert("Quiz title cannot be empty.");
      return;
    }

    if (
      quiz.questions.some(
        (q) =>
          !q.text.trim() ||
          q.options.some((opt) => !opt.trim()) ||
          q.correctAnswer < 1 || // Validate 1-based index
          q.correctAnswer > q.options.length
      )
    ) {
      alert("All questions, options, and correct answers must be properly filled out.");
      return;
    }

    try {
      await ApiService.updateQuiz(id, quizToSave);
      alert("Quiz updated successfully!");
      navigate("/admin/quizzes");
    } catch (err) {
      alert("Failed to save the quiz. Please try again later.");
      console.error(err);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === qIndex
        ? {
            ...q,
            options: q.options.map((opt, j) => (j === optIndex ? value : opt)),
          }
        : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === qIndex ? { ...q, correctAnswer: value } : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleAddOption = (qIndex) => {
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === qIndex ? { ...q, options: [...q.options, ""] } : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleDeleteOption = (qIndex, optIndex) => {
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === qIndex
        ? { ...q, options: q.options.filter((_, j) => j !== optIndex) }
        : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { text: "", options: ["", ""], correctAnswer: 1 }, // Initialize with 1-based index
      ],
    });
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  if (loading) return <div className="p-6 text-center">Loading quiz...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Quiz</h1>
      <div className="mb-4">
        <label className="block font-medium mb-2">Quiz Title</label>
        <input
          type="text"
          className="border px-4 py-2 rounded w-full"
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
        />
      </div>

      <h2 className="text-xl font-bold mb-4">Questions</h2>
      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-4 border p-4 rounded">
          <label className="block font-medium mb-2">Question</label>
          <input
            type="text"
            className="border px-4 py-2 rounded w-full"
            value={q.text}
            onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
          />

          <h3 className="font-medium mt-4">Options</h3>
          {q.options.map((opt, optIndex) => (
            <div key={optIndex} className="flex items-center mb-2">
              <input
                type="text"
                className="border px-4 py-2 rounded w-full mr-2"
                value={opt}
                onChange={(e) =>
                  handleOptionChange(qIndex, optIndex, e.target.value)
                }
              />
              <button
                onClick={() => handleDeleteOption(qIndex, optIndex)}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            onClick={() => handleAddOption(qIndex)}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Option
          </button>

          <label className="block font-medium mt-4">Correct Answer</label>
          <select
            className="border px-4 py-2 rounded w-full"
            value={q.correctAnswer} // 1-based index
            onChange={(e) =>
              handleCorrectAnswerChange(qIndex, parseInt(e.target.value, 10))
            }
          >
            {q.options.map((_, optIndex) => (
              <option key={optIndex} value={optIndex + 1}>
                Option {optIndex + 1}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleDeleteQuestion(qIndex)}
            className="text-red-500 mt-4"
          >
            Delete Question
          </button>
        </div>
      ))}

      <button
        onClick={handleAddQuestion}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Add Question
      </button>

      <button
        onClick={handleSaveQuiz}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4"
      >
        Save Quiz
      </button>
    </div>
  );
};

export default EditQuiz;
