"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { quizAPI, quoteAPI } from "../services/api";
import {
  Home,
  BookOpen,
  BarChart3,
  Gamepad2,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  User,
  Award,
  TrendingUp,
  Clock,
  Star,
  Play,
  Leaf,
  Zap,
  Plus,
  Trophy,
  ChevronRight,
  LogOut,
  Flame,
  Eye,
  MessageSquare,
} from "lucide-react";

const Dashboard = () => {
  const [showSortTrashGame, setShowSortTrashGame] = useState(false);
  const [showGrowTreeGame, setShowGrowTreeGame] = useState(false);
  const { user, userRole, logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [todaysQuote, setTodaysQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    lastActivity: null,
    hoursUntilLoss: 0,
    isAtRisk: false,
  });
  // Video modal state for video lectures
  const [selectedVideo, setSelectedVideo] = useState(null);

  const calculateStreak = () => {
    const lastActivity = localStorage.getItem("lastQuizActivity");
    const streakCount = Number.parseInt(
      localStorage.getItem("currentStreak") || "0"
    );

    console.log(
      "[v0] Calculating streak - lastActivity:",
      lastActivity,
      "streakCount:",
      streakCount
    );

    if (!lastActivity) {
      const currentTime = Date.now();
      localStorage.setItem("lastQuizActivity", currentTime.toString());
      localStorage.setItem("currentStreak", "1");
      console.log("[v0] No previous activity found, setting initial streak");
      setStreakData({
        currentStreak: 1,
        lastActivity: new Date(currentTime),
        hoursUntilLoss: 24,
        isAtRisk: false,
      });
      return;
    }

    const lastActivityTimestamp = Number.parseInt(lastActivity);
    const now = Date.now();

    console.log("[v0] Last activity timestamp:", lastActivityTimestamp);
    console.log("[v0] Current timestamp:", now);
    console.log("[v0] Last activity date:", new Date(lastActivityTimestamp));
    console.log("[v0] Current date:", new Date(now));

    const timeDiff = now - lastActivityTimestamp;
    const hoursSinceActivity = Math.floor(timeDiff / (1000 * 60 * 60));
    const hoursUntilLoss = Math.max(0, 24 - hoursSinceActivity);
    const isAtRisk = hoursUntilLoss <= 6 && hoursUntilLoss > 0;

    console.log("[v0] Time difference (ms):", timeDiff);
    console.log(
      "[v0] Hours since activity:",
      hoursSinceActivity,
      "Hours until loss:",
      hoursUntilLoss
    );

    if (hoursSinceActivity >= 24) {
      localStorage.setItem("currentStreak", "0");
      console.log("[v0] Streak reset to 0");
      setStreakData({
        currentStreak: 0,
        lastActivity: new Date(lastActivityTimestamp),
        hoursUntilLoss: 0,
        isAtRisk: false,
      });
    } else {
      console.log("[v0] Streak maintained:", streakCount);
      setStreakData({
        currentStreak: streakCount,
        lastActivity: new Date(lastActivityTimestamp),
        hoursUntilLoss,
        isAtRisk,
      });
    }
  };

  const simulateQuizActivity = () => {
    const currentTime = Date.now();
    const currentStreak =
      Number.parseInt(localStorage.getItem("currentStreak") || "0") + 1;
    localStorage.setItem("lastQuizActivity", currentTime.toString());
    localStorage.setItem("currentStreak", currentStreak.toString());
    console.log("[v0] Simulated quiz activity at:", new Date(currentTime));
    calculateStreak();
  };

  useEffect(() => {
    console.log("[v0] Component mounted, calculating streak...");
    calculateStreak();

    const streakInterval = setInterval(() => {
      console.log("[v0] Recalculating streak...");
      calculateStreak();
    }, 1000); // Check every 1 second for immediate updates

    // Add window focus event to recalculate when user returns to tab
    const handleFocus = () => {
      console.log("[v0] Window focused, recalculating streak...");
      calculateStreak();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        console.log("[v0] Tab became visible, recalculating streak...");
        calculateStreak();
      }
    });

    return () => {
      clearInterval(streakInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesData, quoteData] = await Promise.all([
          quizAPI.getAllQuizzes(),
          quoteAPI.getTodaysQuote(),
        ]);
        setQuizzes(quizzesData);
        setTodaysQuote(quoteData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardHover = (cardId) => {
    setActiveCard(cardId);
  };

  const handleCardLeave = () => {
    setActiveCard(null);
  };

  const sidebarItems = [
    {
      icon: Home,
      label: "Dashboard",
      key: "dashboard",
      active: activeView === "dashboard",
    },
    {
      icon: BookOpen,
      label: "Quizzes",
      key: "quizzes",
      active: activeView === "quizzes",
    },
    {
      icon: Play,
      label: "Video Lectures",
      key: "videos",
      active: activeView === "videos",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      key: "analytics",
      active: activeView === "analytics",
    },
    {
      icon: Gamepad2,
      label: "Games",
      key: "games",
      active: activeView === "games",
    },
    {
      icon: FileText,
      label: "Reports",
      key: "reports",
      active: activeView === "reports",
    },
    ...(userRole === "teacher"
      ? [
          {
            icon: Users,
            label: "Students",
            key: "users",
            active: activeView === "users",
          },
        ]
      : []),
    {
      icon: Settings,
      label: "Settings",
      key: "settings",
      active: activeView === "settings",
    },
  ];

  const handleNavigation = (key) => {
    setActiveView(key);
    setSidebarOpen(false); // Close mobile sidebar
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "quizzes":
        return renderQuizzesView();
      case "videos":
        return renderVideosView();
      case "analytics":
        return renderAnalyticsView();
      case "games":
        return renderGamesView();
      case "reports":
        return renderReportsView();
      case "users":
        return renderUsersView();
      case "settings":
        return renderSettingsView();
      default:
        return renderDashboardView();
    }
  };

  const renderQuizzesView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">All Quizzes</h2>
        {userRole === "teacher" && (
          <Link
            to="/quiz/create"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Quiz</span>
          </Link>
        )}
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl text-center">
          <BookOpen className="h-16 w-16 text-blue-300 mx-auto mb-6" />
          <h4 className="text-2xl font-bold text-white mb-4">
            No quizzes available
          </h4>
          <p className="text-blue-200">
            {userRole === "teacher"
              ? "Create your first quiz to get started!"
              : "Check back soon for new quizzes!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
            >
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white">{quiz.title}</h4>
                <div className="flex items-center space-x-4 text-blue-200 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>15 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>{quiz.questions?.length || 0} questions</span>
                  </div>
                </div>
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Quiz</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">
        Environmental Studies Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Quiz Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-200">Average Score:</span>
              <span className="text-white font-bold">87%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Completed Quizzes:</span>
              <span className="text-white font-bold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Time Spent:</span>
              <span className="text-white font-bold">4.5 hrs</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-sm">
              <div className="text-white font-medium">
                Climate Change Basics
              </div>
              <div className="text-blue-200">Scored 92% • 2 hours ago</div>
            </div>
            <div className="text-sm">
              <div className="text-white font-medium">
                Renewable Energy Systems
              </div>
              <div className="text-blue-200">Scored 85% • 1 day ago</div>
            </div>
            <div className="text-sm">
              <div className="text-white font-medium">
                Biodiversity Conservation
              </div>
              <div className="text-blue-200">Scored 78% • 2 days ago</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Environmental Achievements
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="text-white">Eco Warrior</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-green-400" />
              <span className="text-white">Climate Champion</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-400" />
              <span className="text-white">Sustainability Expert</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Environmental Subject Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">92%</div>
            <div className="text-blue-200 text-sm">Climate Change</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">88%</div>
            <div className="text-green-200 text-sm">Renewable Energy</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">85%</div>
            <div className="text-purple-200 text-sm">Biodiversity</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">79%</div>
            <div className="text-orange-200 text-sm">Sustainability</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGamesView = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Learning Games</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group cursor-pointer">
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl mx-auto w-fit">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Quiz Battle</h3>
            <p className="text-blue-200">
              Challenge other students in real-time quiz battles
            </p>
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
              Play Now
            </button>
          </div>
        </div> */}

        

        

         {/* Grow Your Tree Game Card */}
         <div className="bg-white/10 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group text-center">
           <img src="https://img.icons8.com/emoji/96/deciduous-tree-emoji.png" alt="Grow Your Tree Logo" className="mx-auto mb-4 w-20 h-20 rounded-full shadow" />
           <h3 className="text-xl font-bold text-green-700 mb-2">Grow Your Tree</h3>
           <p className="text-green-600 mb-4">Play and learn how trees grow!</p>
           <button
             className="bg-green-500 text-white font-semibold py-2 px-6 rounded-xl shadow hover:bg-green-600 transition-all duration-300"
             onClick={() => setShowGrowTreeGame(true)}
           >
             Play
           </button>
         </div>
        {/* Sort the Trash Game Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group text-center">
          <img src="https://img.icons8.com/emoji/96/wastebasket-emoji.png" alt="Sort the Trash Logo" className="mx-auto mb-4 w-20 h-20 rounded-full shadow" />
          <h3 className="text-xl font-bold text-yellow-700 mb-2">Sort the Trash</h3>
          <p className="text-yellow-600 mb-4">Play and learn how to sort waste!</p>
          <button
            className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded-xl shadow hover:bg-yellow-600 transition-all duration-300"
            onClick={() => setShowSortTrashGame(true)}
          >
            Play
          </button>
        </div>
      {/* Modal for Sort the Trash Game */}
      {showSortTrashGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-xl shadow-lg p-8 relative w-full max-w-3xl flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-black text-xl font-bold"
              onClick={() => setShowSortTrashGame(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-yellow-700">Sort the Trash Game</h2>
            <iframe src="https://scratch.mit.edu/projects/1215200115/embed" allowtransparency="true" width="800" height="500" frameBorder="0" scrolling="no" allowFullScreen className="rounded-lg border mb-6"></iframe>
            <p className="text-yellow-700 text-center">Interact with the game to learn how to sort trash correctly!</p>
          </div>
        </div>
      )}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group cursor-pointer">
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-2xl mx-auto w-fit">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Leaderboard</h3>
            <p className="text-blue-200">
              Compete for the top spot on the leaderboard
            </p>
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
              View Rankings
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group cursor-pointer">
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl mx-auto w-fit">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Speed Quiz</h3>
            <p className="text-blue-200">
              Test your knowledge against the clock
            </p>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
              Start Game
            </button>
          </div>
        </div>

      </div>

      {/* Modal for Grow Your Tree Game */}
      {showGrowTreeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-xl shadow-lg p-8 relative w-full max-w-3xl flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-black text-xl font-bold"
              onClick={() => setShowGrowTreeGame(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-green-700">Grow Your Tree Game</h2>
            <iframe src="https://scratch.mit.edu/projects/1215616271/embed" allowtransparency="true" width="800" height="500" frameBorder="0" scrolling="no" allowFullScreen className="rounded-lg border mb-6"></iframe>
            <p className="text-green-700 text-center">Interact with the game to learn how trees grow!</p>
          </div>
          
        </div>
        
      )}

      
    </div>
  );

  const renderReportsView = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Reports & Statistics</h2>

      {streakData.isAtRisk && (
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-6 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-xl font-bold text-red-300">Streak Alert!</h3>
              <p className="text-red-200">
                You're about to lose your {streakData.currentStreak}-day streak!
                Complete a quiz in the next {streakData.hoursUntilLoss} hours to
                keep it alive.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Performance Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Total Quizzes Taken:</span>
              <span className="text-2xl font-bold text-white">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Average Score:</span>
              <span className="text-2xl font-bold text-green-400">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Best Subject:</span>
              <span className="text-lg font-bold text-white">
                Climate Change
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Study Streak:</span>
              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${
                    streakData.isAtRisk
                      ? "text-red-400"
                      : streakData.currentStreak > 0
                      ? "text-yellow-400"
                      : "text-blue-400"
                  }`}
                >
                  {streakData.currentStreak} days
                </div>
                {streakData.hoursUntilLoss > 0 &&
                  streakData.currentStreak > 0 && (
                    <div className="text-xs text-blue-300">
                      {streakData.hoursUntilLoss}h left
                    </div>
                  )}
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-xl">
              <p
                className={`text-sm ${
                  getStreakMessage().color
                } flex items-center space-x-2`}
              >
                <span>{getStreakMessage().icon}</span>
                <span>{getStreakMessage().message}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Weekly Progress</h3>
          <div className="space-y-4">
            <div className="text-sm text-blue-200">This week vs last week</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-white">+15% improvement</span>
            </div>
            <div className="text-sm text-blue-200">
              Quizzes completed: 8 (+3)
            </div>
            <div className="text-sm text-blue-200">
              Average time: 12 min (-2 min)
            </div>
          </div>
        </div>
      </div>

      {userRole === "teacher" && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              Class Environmental Studies Statistics
            </h3>
            <Link
              to="/student-progress"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>View Detailed Report</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">5</div>
              <div className="text-blue-200">Total Students</div>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-blue-200">Quiz Attempts</div>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">78%</div>
              <div className="text-blue-200">Class Average</div>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400">12</div>
              <div className="text-blue-200">Active Streaks</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-white mb-2">
                Climate Change
              </h4>
              <div className="text-2xl font-bold text-blue-400">82%</div>
              <div className="text-sm text-blue-200">Average Score</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-white mb-2">
                Renewable Energy
              </h4>
              <div className="text-2xl font-bold text-green-400">89%</div>
              <div className="text-sm text-blue-200">Average Score</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-white mb-2">
                Biodiversity
              </h4>
              <div className="text-2xl font-bold text-purple-400">75%</div>
              <div className="text-sm text-blue-200">Average Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettingsView = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Profile Settings
          </h3>
          <div className="space-y-4">
            <Link
              to="/profile"
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-blue-400" />
                <span className="text-white">Update Profile</span>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-300" />
            </Link>

            {/* <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-blue-400" />
                <span className="text-white">Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div> */}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Account</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-blue-200">Username</div>
              <div className="text-white font-medium">{user?.username}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-blue-200">Email</div>
              <div className="text-white font-medium">{user?.email}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-blue-200">Role</div>
              <div className="text-white font-medium capitalize">
                {userRole}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVideosView = () => {
  const videoLectures = [
      {
        id: 2,
        title: "Renewable Energy: Solar and Wind Power",
        instructor: "Prof. Michael Chen",
        duration: "3 min",
        thumbnail:
          "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
        category: "Renewable Energy",
        rating: 4.9,
        views: "8.2K",
        description: "Learn about sustainable energy solutions for the future",
        videoUrl: "https://youtu.be/1kUE0BZtTRc?si=l-DvrAZ2EdZ0yVya",
      },
      {
        id: 3,
        title: "Biodiversity and Wildlife Conservation",
        instructor: "Dr. Emma Rodriguez",
        duration: "5 min",
        thumbnail:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        category: "Conservation",
        rating: 4.7,
        views: "15.3K",
        description: "Understanding ecosystem balance and species protection",
        videoUrl: "https://youtu.be/GK_vRtHJZu4?si=WN_X9pK4TBExvO_q",
      },
      {
        id: 4,
        title: "Sustainable Living: Reduce, Reuse, Recycle",
        instructor: "Prof. David Kim",
        duration: "3 min",
        thumbnail:
          "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
        category: "Sustainability",
        rating: 4.6,
        views: "9.8K",
        description: "Practical tips for environmentally conscious living",
        videoUrl: "https://youtu.be/OasbYWF4_S8?si=yBu2vFKvz17cfGcf",
      },
    ];

    return (
      <div className="space-y-6">
        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white rounded-xl shadow-lg p-6 relative w-full max-w-2xl">
              <button
                className="absolute top-2 right-2 text-black text-xl font-bold"
                onClick={() => setSelectedVideo(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-lg font-bold mb-4">{selectedVideo.title}</h2>
              {/* Check if YouTube link */}
              {selectedVideo.videoUrl.includes("youtube.com") || selectedVideo.videoUrl.includes("youtu.be") ? (
                <iframe
                  width="100%"
                  height="360"
                  src={
                    selectedVideo.videoUrl.includes("youtube.com")
                      ? selectedVideo.videoUrl.replace("watch?v=", "embed/")
                      : `https://www.youtube.com/embed/${selectedVideo.videoUrl.split("/").pop().split("?")[0]}`
                  }
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full rounded-lg mb-4"
                />
              ) : (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-64 bg-black rounded-lg mb-4"
                />
              )}
              <p className="text-gray-700 mb-2">{selectedVideo.description}</p>
              <span className="text-sm text-gray-500">Instructor: {selectedVideo.instructor}</span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Environmental Studies Video Lectures
          </h2>
          <div className="flex space-x-2">
            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
              <option value="">All Categories</option>
              <option value="climate">Climate Science</option>
              <option value="energy">Renewable Energy</option>
              <option value="conservation">Conservation</option>
              <option value="sustainability">Sustainability</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoLectures.map((video) => (
            <div
              key={video.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-sm">{video.duration}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                    {video.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm">{video.rating}</span>
                  </div>
                </div>

                <h3 className="text-white font-semibold mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{video.instructor}</span>
                  <span className="text-white/60">{video.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-500/20 rounded-full p-3">
              <Leaf className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                🌱 Eco-Learning Progress
              </h3>
              <p className="text-green-200">
                You've completed 3 environmental studies modules this week! Keep
                learning to protect our planet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboardView = () => {
    if (userRole === "teacher") {
      return renderTeacherDashboard();
    }
    return renderStudentDashboard();
  };

  const renderTeacherDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || user?.username || "Teacher"}! 👨‍🏫
          </h2>
          <p className="text-blue-200">
            Manage your environmental studies classes and track student progress
          </p>
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Total Students
                </h3>
                <p className="text-3xl font-bold text-blue-300">5</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Active Quizzes
                </h3>
                <p className="text-3xl font-bold text-green-300">8</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Avg Class Score
                </h3>
                <p className="text-3xl font-bold text-purple-300">78%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Quiz Attempts
                </h3>
                <p className="text-3xl font-bold text-orange-300">56</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/quiz/create"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Quiz</span>
            </Link>

            <button
              onClick={() => handleNavigation("users")}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
            >
              <Users className="h-5 w-5" />
              <span>Manage Students</span>
            </button>

            <button
              onClick={() => handleNavigation("analytics")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
            >
              <BarChart3 className="h-5 w-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Student Activity */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Recent Student Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">JS</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">John Smith</p>
                    <p className="text-blue-200 text-sm">
                      Completed Climate Change Quiz
                    </p>
                  </div>
                </div>
                <span className="text-green-400 font-bold">95%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">MJ</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Maria Johnson</p>
                    <p className="text-blue-200 text-sm">
                      Completed Renewable Energy Quiz
                    </p>
                  </div>
                </div>
                <span className="text-green-400 font-bold">88%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AB</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Alex Brown</p>
                    <p className="text-blue-200 text-sm">
                      Started Biodiversity Quiz
                    </p>
                  </div>
                </div>
                <span className="text-yellow-400 font-bold">In Progress</span>
              </div>
            </div>
          </div>

          {/* Class Performance Chart */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Class Performance Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-200">Climate Change</span>
                  <span className="text-white">85%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-200">Renewable Energy</span>
                  <span className="text-white">78%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-200">Biodiversity</span>
                  <span className="text-white">92%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-200">Sustainability</span>
                  <span className="text-white">73%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                    style={{ width: "73%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact Tracker */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-500/20 rounded-full p-3">
              <Leaf className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                🌍 Class Environmental Impact
              </h3>
              <p className="text-green-200">
                Your students have completed 156 environmental quizzes this
                month, contributing to a more sustainable future!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStudentDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || user?.username || "Student"}! 👋
          </h2>
          <p className="text-blue-200">
            Ready to continue your learning journey?
          </p>
        </div>

        <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-xl border border-violet-400/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-3 rounded-xl">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Learning Streak
                </h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-2xl font-bold ${
                      streakData.isAtRisk
                        ? "text-red-400"
                        : streakData.currentStreak > 0
                        ? "text-yellow-400"
                        : "text-blue-400"
                    }`}
                  >
                    {streakData.currentStreak} days
                  </span>
                  {streakData.hoursUntilLoss > 0 &&
                    streakData.currentStreak > 0 && (
                      <span className="text-xs text-blue-300">
                        ({streakData.hoursUntilLoss}h left)
                      </span>
                    )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm ${
                  getStreakMessage().color
                } flex items-center space-x-2`}
              >
                <span>{getStreakMessage().icon}</span>
                <span className="max-w-xs">{getStreakMessage().message}</span>
              </p>
            </div>
          </div>
        </div>

        {streakData.isAtRisk && (
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="text-xl font-bold text-red-300">
                  Streak Alert!
                </h3>
                <p className="text-red-200">
                  You're about to lose your {streakData.currentStreak}-day
                  streak! Complete a quiz in the next{" "}
                  {streakData.hoursUntilLoss} hours to keep it alive.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                <div className="bg-blue-500 rounded-full p-2">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    Environmental Basics Quiz
                  </p>
                  <p className="text-blue-200 text-sm">
                    Completed • Score: 92%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                <div className="bg-green-500 rounded-full p-2">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Achievement Unlocked</p>
                  <p className="text-green-200 text-sm">Quiz Master Badge</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                <div className="bg-purple-500 rounded-full p-2">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Progress Update</p>
                  <p className="text-purple-200 text-sm">
                    15% improvement this week
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Today's Quote</h3>
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Star className="h-4 w-4 text-white" />
              </div>
            </div>
            {todaysQuote ? (
              <div className="space-y-4">
                <blockquote className="text-white italic text-lg leading-relaxed">
                  "{todaysQuote.text}"
                </blockquote>
                <cite className="text-blue-200 text-sm">
                  — {todaysQuote.author}
                </cite>
              </div>
            ) : (
              <div className="space-y-4">
                <blockquote className="text-white italic text-lg leading-relaxed">
                  "The beautiful thing about learning is that no one can take it
                  away from you."
                </blockquote>
                <cite className="text-blue-200 text-sm">— B.B. King</cite>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderUsersView = () => {
    if (userRole !== "teacher") {
      return (
        <div className="p-6 text-center">
          <p className="text-white/70">
            Access denied. This section is for teachers only.
          </p>
        </div>
      );
    }

    const students = [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        streak: 15,
        lastActive: "2 hours ago",
        progress: 85,
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        streak: 8,
        lastActive: "1 day ago",
        progress: 72,
      },
      {
        id: 3,
        name: "Carol Davis",
        email: "carol@example.com",
        streak: 22,
        lastActive: "30 minutes ago",
        progress: 94,
      },
      {
        id: 4,
        name: "David Wilson",
        email: "david@example.com",
        streak: 3,
        lastActive: "3 hours ago",
        progress: 58,
      },
      {
        id: 5,
        name: "Eva Brown",
        email: "eva@example.com",
        streak: 12,
        lastActive: "1 hour ago",
        progress: 79,
      },
    ];

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Student Management</h2>
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-300">
            Add Student
          </button>
        </div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-white/70 text-sm">Total Students</p>
                <p className="text-white text-xl font-bold">
                  {students.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white/70 text-sm">Active Today</p>
                <p className="text-white text-xl font-bold">
                  {
                    students.filter(
                      (s) =>
                        s.lastActive.includes("hour") ||
                        s.lastActive.includes("minute")
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-white/70 text-sm">Avg Progress</p>
                <p className="text-white text-xl font-bold">
                  {Math.round(
                    students.reduce((acc, s) => acc + s.progress, 0) /
                      students.length
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Flame className="h-8 w-8 text-orange-400" />
              <div>
                <p className="text-white/70 text-sm">Highest Streak</p>
                <p className="text-white text-xl font-bold">
                  {Math.max(...students.map((s) => s.streak))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
          <div className="p-4 border-b border-white/20">
            <h3 className="text-lg font-semibold text-white">Student List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-white/70 font-medium">
                    Student
                  </th>
                  <th className="text-left p-4 text-white/70 font-medium">
                    Email
                  </th>
                  <th className="text-left p-4 text-white/70 font-medium">
                    Streak
                  </th>
                  <th className="text-left p-4 text-white/70 font-medium">
                    Progress
                  </th>
                  <th className="text-left p-4 text-white/70 font-medium">
                    Last Active
                  </th>
                  <th className="text-left p-4 text-white/70 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-white/70">{student.email}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Flame className="h-4 w-4 text-orange-400" />
                        <span className="text-white font-medium">
                          {student.streak}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-white/70">{student.lastActive}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-400 hover:text-green-300 transition-colors">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const getStreakMessage = () => {
    if (streakData.currentStreak === 0) {
      return {
        message: "Start your eco-learning journey today! 🌱",
        color: "text-blue-300",
        icon: "🚀",
      };
    }

    if (streakData.isAtRisk) {
      return {
        message: `⚠️ Your ${streakData.currentStreak}-day eco-streak is at risk! Complete an environmental quiz in ${streakData.hoursUntilLoss} hours to keep saving the planet.`,
        color: "text-red-300",
        icon: "⚠️",
      };
    }

    if (streakData.hoursUntilLoss <= 12) {
      return {
        message: `Keep protecting the environment! Complete a quiz today to maintain your ${streakData.currentStreak}-day eco-streak. 🌍`,
        color: "text-yellow-300",
        icon: "⏰",
      };
    }

    return {
      message: `Amazing! You're on a ${streakData.currentStreak}-day environmental learning streak! Keep saving the planet! 🌟`,
      color: "text-green-300",
      icon: "🔥",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/60 backdrop-blur-xl border border-indigo-200/50 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-indigo-500 to-blue-500 p-4 rounded-full">
                  <BookOpen className="h-8 w-8 text-white animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                  Loading your dashboard...
                </h3>
                <div className="flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Background Elements - Similar to register but with hexagonal patterns */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs - Similar to register but slightly different positions */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>

          {/* Unique Hexagonal Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(139,69,193,0.1),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.1),transparent_50%)]"></div>
            <div
              className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(139,69,193,0.05)_60deg,transparent_120deg)] animate-pulse"
              style={{ animationDuration: "8s" }}
            ></div>
          </div>

          {/* Floating Particles - Similar to register */}
          <div
            className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full opacity-20 animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-40 right-32 w-1 h-1 bg-purple-300 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-40 animate-bounce"
            style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
          ></div>
          <div
            className="absolute bottom-20 right-20 w-2 h-2 bg-violet-300 rounded-full opacity-20 animate-bounce"
            style={{ animationDelay: "3s", animationDuration: "3.5s" }}
          ></div>

          {/* Unique Dashboard Elements - Hexagonal shapes instead of lines */}
          <div
            className="absolute top-1/4 left-1/6 w-8 h-8 border border-purple-400/20 transform rotate-45 animate-spin"
            style={{ animationDuration: "20s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/5 w-6 h-6 bg-violet-400/10 transform rotate-45 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-2/3 left-2/3 w-4 h-4 border-2 border-indigo-400/15 rounded-full animate-spin"
            style={{ animationDuration: "15s" }}
          ></div>
        </div>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-purple-400 rounded-lg blur opacity-60"></div>
                <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-white font-semibold">E-Learning</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.key)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  item.active
                    ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-white border border-white/20"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {React.createElement(item.icon, {
                  className: `h-5 w-5 ${
                    item.active ? "text-white" : "group-hover:text-white"
                  } transition-colors`,
                })}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile in Sidebar */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/10">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user?.name ||
                    (userRole === "teacher" ? "Teacher" : "Student")}
                </p>
                <p className="text-white/70 text-sm capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="relative z-20 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold text-white capitalize">
                  {activeView}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3 bg-white/10 rounded-xl px-4 py-2 border border-white/20">
                  <Search className="h-4 w-4 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent text-white placeholder-white/50 border-none outline-none text-sm"
                  />
                </div>

                <button className="relative p-2 text-white/70 hover:text-white transition-colors hover:scale-110 group">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-white/70 hover:text-red-400 transition-all duration-300 hover:scale-105 group"
                >
                  <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
          {renderActiveView()}
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
