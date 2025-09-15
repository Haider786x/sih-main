"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { adminAPI } from "../services/api";
import { ArrowLeft, Users, TrendingUp, Award, BookOpen } from "lucide-react";

const StudentProgress = () => {
  const { userRole } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [quizStats, setQuizStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("progress");
  const [filterQuiz, setFilterQuiz] = useState("all");
  const [filterStudent, setFilterStudent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progress, stats] = await Promise.all([
          adminAPI.getStudentProgress(),
          adminAPI.getQuizStats(),
        ]);
        setProgressData(progress);
        setQuizStats(stats);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on selected filters
  const filteredProgress = progressData.filter((attempt) => {
    const matchesQuiz = filterQuiz === "all" || attempt.quizId === filterQuiz;
    const matchesStudent =
      filterStudent === "" ||
      attempt.studentName.toLowerCase().includes(filterStudent.toLowerCase()) ||
      attempt.studentEmail.toLowerCase().includes(filterStudent.toLowerCase());
    return matchesQuiz && matchesStudent;
  });

  // Get unique quizzes for filter dropdown
  const uniqueQuizzes = [
    ...new Set(
      progressData.map((attempt) => ({
        id: attempt.quizId,
        title: attempt.quizTitle,
      }))
    ),
  ];

  // Calculate overall statistics
  const totalAttempts = progressData.length;
  const uniqueStudents = new Set(progressData.map((attempt) => attempt.userId))
    .size;
  const averageScore =
    progressData.length > 0
      ? Math.round(
          progressData.reduce((sum, attempt) => sum + attempt.percentage, 0) /
            progressData.length
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (userRole !== "teacher") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            Only teachers can view student progress.
          </p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Student Progress</h1>
          <p className="text-gray-600 mt-2">
            Track student performance and quiz statistics
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {uniqueStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Attempts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalAttempts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Quizzes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {quizStats.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("progress")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "progress"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Student Attempts
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "stats"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Quiz Statistics
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        {activeTab === "progress" && (
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Quiz
                </label>
                <select
                  value={filterQuiz}
                  onChange={(e) => setFilterQuiz(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Quizzes</option>
                  {uniqueQuizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Student
                </label>
                <input
                  type="text"
                  value={filterStudent}
                  onChange={(e) => setFilterStudent(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "progress" ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Student Attempts ({filteredProgress.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Track student performance across environmental studies topics
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Environmental Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attempt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProgress.map((attempt, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {attempt.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {attempt.studentEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {attempt.environmentalTopic}
                        </div>
                        <div className="text-sm text-gray-500">
                          by {attempt.quizCreatedBy}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`text-sm font-medium ${
                              attempt.percentage >= 70
                                ? "text-green-600"
                                : attempt.percentage >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {attempt.percentage}%
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({attempt.score}/{attempt.totalQuestions})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Attempt {attempt.attemptNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(attempt.attemptedAt).toLocaleDateString()} at{" "}
                        {new Date(attempt.attemptedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProgress.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No attempts found
                  </h4>
                  <p className="text-gray-600">
                    No student attempts match your current filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizStats.map((stat) => (
              <div
                key={stat.quizId}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {stat.quizTitle}
                </h3>
                <div className="mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Environmental Studies
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Questions:</span>
                    <span className="text-sm font-medium">
                      {stat.totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Total Attempts:
                    </span>
                    <span className="text-sm font-medium">
                      {stat.totalAttempts}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Unique Students:
                    </span>
                    <span className="text-sm font-medium">
                      {stat.uniqueStudents}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Average Score:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        stat.averageScore >= 70
                          ? "text-green-600"
                          : stat.averageScore >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.averageScore}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created by:</span>
                    <span className="text-sm font-medium">
                      {stat.createdBy}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {quizStats.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No environmental quizzes found
                </h4>
                <p className="text-gray-600">
                  No environmental studies quizzes have been created yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
