"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { quizAPI } from "../services/api";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAttempts, setUserAttempts] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const [quizData, attemptsData] = await Promise.all([
          quizAPI.getQuizById(id),
          quizAPI.getUserAttempts(id),
        ]);
        setQuiz(quizData);
        setUserAttempts(attemptsData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuizData();
    }
  }, [id, navigate]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = async () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);

      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz completed - submit to backend
        await submitQuiz(newAnswers);
      }
    }
  };

  const submitQuiz = async (userAnswers) => {
    setSubmitting(true);
    try {
      const result = await quizAPI.submitQuizAttempt(id, userAnswers);
      setScore(result.score);
      setShowResult(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      if (error.response?.status === 429) {
        alert("You have already used all 2 attempts for this quiz!");
        navigate("/dashboard");
      } else {
        alert("Error submitting quiz. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    if (userAttempts && userAttempts.attemptsRemaining > 0) {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnswers([]);
      setShowResult(false);
      setScore(0);
    } else {
      alert("You have no attempts remaining for this quiz!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quiz not found
          </h2>
          <Link
            to="/dashboard"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Check if user has no attempts remaining
  if (userAttempts && userAttempts.attemptsRemaining === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Attempts Remaining
            </h2>
            <p className="text-gray-600 mb-6">
              You have used all 2 attempts for this quiz. You cannot take this
              quiz again.
            </p>

            {userAttempts.attempts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Previous Attempts:
                </h3>
                <div className="space-y-3">
                  {userAttempts.attempts.map((attempt, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Attempt {index + 1}</span>
                        <span className="text-lg font-bold text-indigo-600">
                          {attempt.score}/{attempt.totalQuestions} (
                          {Math.round(
                            (attempt.score / attempt.totalQuestions) * 100
                          )}
                          %)
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(attempt.attemptedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 mt-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <div
                className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  percentage >= 70 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {percentage >= 70 ? (
                  <CheckCircle className="h-10 w-10 text-green-600" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-600" />
                )}
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Quiz Completed!
              </h2>

              <div className="text-6xl font-bold text-indigo-600 mb-4">
                {percentage}%
              </div>

              <p className="text-gray-600 mb-6">
                You scored {score} out of {quiz.questions.length} questions
                correctly
              </p>

              <div className="flex justify-center space-x-4">
                {userAttempts && userAttempts.attemptsRemaining > 0 ? (
                  <button
                    onClick={resetQuiz}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Quiz ({userAttempts.attemptsRemaining} attempts left)
                  </button>
                ) : (
                  <div className="text-sm text-gray-500">
                    No attempts remaining
                  </div>
                )}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            {userAttempts && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Attempts remaining: </span>
                <span
                  className={`font-bold ${
                    userAttempts.attemptsRemaining === 1
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {userAttempts.attemptsRemaining}/2
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedAnswer === index
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium text-gray-900">{option}</span>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null || submitting}
              className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Submitting..."
                : currentQuestion < quiz.questions.length - 1
                ? "Next Question"
                : "Finish Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
