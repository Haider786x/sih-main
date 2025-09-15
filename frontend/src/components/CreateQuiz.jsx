"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { quizAPI } from "../services/api";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [quiz, setQuiz] = useState({
    title: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        answer: 0,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          question: "",
          options: ["", "", "", ""],
          answer: 0,
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (quiz.questions.length > 1) {
      setQuiz({
        ...quiz,
        questions: quiz.questions.filter((_, i) => i !== index),
      });
    }
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate quiz
    if (!quiz.title.trim()) {
      setError("Quiz title is required");
      setLoading(false);
      return;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      if (!question.question.trim()) {
        setError(`Question ${i + 1} is required`);
        setLoading(false);
        return;
      }

      const hasEmptyOptions = question.options.some((option) => !option.trim());
      if (hasEmptyOptions) {
        setError(`All options for question ${i + 1} are required`);
        setLoading(false);
        return;
      }
    }

    try {
      console.log("Creating quiz with data:", quiz);
      console.log("User role:", userRole);
      const result = await quizAPI.createQuiz(quiz);
      console.log("Quiz created successfully:", result);
      navigate("/dashboard");
    } catch (error) {
      console.error("Quiz creation error:", error);
      setError(
        error.response?.data?.error || error.message || "Failed to create quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-gray-600 mt-2">
            Design an interactive quiz for other learners
          </p>
          {userRole && (
            <div className="mt-2 text-sm text-indigo-600">
              Logged in as:{" "}
              <span className="font-medium capitalize">{userRole}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Quiz Title */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter quiz title"
              required
            />
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {quiz.questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Question {questionIndex + 1}
                  </h3>
                  {quiz.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Question Text */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(questionIndex, "question", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your question"
                    rows={3}
                    required
                  />
                </div>

                {/* Options */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          checked={question.answer === optionIndex}
                          onChange={() =>
                            updateQuestion(questionIndex, "answer", optionIndex)
                          }
                          className="mr-3 text-indigo-600 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(
                              questionIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Select the correct answer by clicking the radio button
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </button>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? "Creating Quiz..." : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
