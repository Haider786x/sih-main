"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Eye,
  EyeOff,
  BookOpen,
  GraduationCap,
  Mail,
  Lock,
  User,
  UserCheck,
  Loader2,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);
  const [inputFocus, setInputFocus] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  // Declare handleSubmit and handleChange functions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(
        formData.email,
        formData.password,
        formData.username,
        formData.role
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create account");
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (field) => {
    setInputFocus((prev) => ({ ...prev, [field]: true }));
    setIsFormFocused(true);
  };

  const handleInputBlur = (field) => {
    setInputFocus((prev) => ({ ...prev, [field]: false }));
    const anyFocused = Object.values({ ...inputFocus, [field]: false }).some(
      Boolean
    );
    setIsFormFocused(anyFocused);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Floating Particles */}
        <div
          className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-1 h-1 bg-purple-300 rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-50 animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-2 h-2 bg-violet-300 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "3s", animationDuration: "3.5s" }}
        ></div>

        {/* Animated Lines */}
        <div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-20 animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-indigo-400 to-transparent opacity-15 animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
      </div>

      <div
        className={`relative z-10 w-full max-w-md transition-all duration-700 ${
          isFormFocused ? "scale-105" : "scale-100"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative inline-block">
            {/* Rotating Ring */}
            <div
              className="absolute -inset-2 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-full blur-lg opacity-60 animate-spin"
              style={{ animationDuration: "8s" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 p-4 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
              {formData.role === "teacher" ? (
                <GraduationCap className="h-10 w-10 text-white animate-pulse" />
              ) : (
                <BookOpen className="h-10 w-10 text-white animate-pulse" />
              )}
              {/* Sparkle Effects */}
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-ping" />
              <Zap className="absolute -bottom-1 -left-1 h-3 w-3 text-blue-300 animate-bounce" />
            </div>
          </div>

          <h1
            className="mt-6 text-4xl font-bold text-white mb-2 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Join Our Platform
          </h1>
          <p
            className="text-purple-200 text-lg mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Create your {formData.role} account
          </p>
        </div>

        {/* Register Card */}
        <div
          className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 animate-fade-in-up hover:shadow-3xl hover:bg-white/15 ${
            isFormFocused ? "border-purple-400/50 shadow-purple-500/20" : ""
          }`}
          style={{ animationDelay: "0.8s" }}
        >
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl backdrop-blur-sm animate-shake">
              <div className="text-red-100 font-medium text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-white/90"
              >
                Username
              </label>
              <div
                className={`relative group transition-all duration-300 ${
                  inputFocus.username ? "scale-105" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 transition-opacity duration-300 ${
                    inputFocus.username ? "opacity-20" : ""
                  }`}
                ></div>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User
                    className={`h-5 w-5 transition-all duration-300 ${
                      inputFocus.username
                        ? "text-white scale-110"
                        : "text-purple-300"
                    }`}
                  />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => handleInputFocus("username")}
                  onBlur={() => handleInputBlur("username")}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder-purple-200 backdrop-blur-sm hover:bg-white/15"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white/90"
              >
                Email Address
              </label>
              <div
                className={`relative group transition-all duration-300 ${
                  inputFocus.email ? "scale-105" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 transition-opacity duration-300 ${
                    inputFocus.email ? "opacity-20" : ""
                  }`}
                ></div>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail
                    className={`h-5 w-5 transition-all duration-300 ${
                      inputFocus.email
                        ? "text-white scale-110"
                        : "text-purple-300"
                    }`}
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleInputFocus("email")}
                  onBlur={() => handleInputBlur("email")}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder-purple-200 backdrop-blur-sm hover:bg-white/15"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-white/90"
              >
                Password
              </label>
              <div
                className={`relative group transition-all duration-300 ${
                  inputFocus.password ? "scale-105" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 transition-opacity duration-300 ${
                    inputFocus.password ? "opacity-20" : ""
                  }`}
                ></div>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 transition-all duration-300 ${
                      inputFocus.password
                        ? "text-white scale-110"
                        : "text-purple-300"
                    }`}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleInputFocus("password")}
                  onBlur={() => handleInputBlur("password")}
                  className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder-purple-200 backdrop-blur-sm hover:bg-white/15"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-white/10 rounded-r-2xl transition-all duration-300 group hover:scale-110"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-purple-300 group-hover:text-white transition-all duration-300 group-hover:rotate-12" />
                  ) : (
                    <Eye className="h-5 w-5 text-purple-300 group-hover:text-white transition-all duration-300 group-hover:rotate-12" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-white/90"
              >
                Confirm Password
              </label>
              <div
                className={`relative group transition-all duration-300 ${
                  inputFocus.confirmPassword ? "scale-105" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 transition-opacity duration-300 ${
                    inputFocus.confirmPassword ? "opacity-20" : ""
                  }`}
                ></div>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 transition-all duration-300 ${
                      inputFocus.confirmPassword
                        ? "text-white scale-110"
                        : "text-purple-300"
                    }`}
                  />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleInputFocus("confirmPassword")}
                  onBlur={() => handleInputBlur("confirmPassword")}
                  className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder-purple-200 backdrop-blur-sm hover:bg-white/15"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-white/10 rounded-r-2xl transition-all duration-300 group hover:scale-110"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-purple-300 group-hover:text-white transition-all duration-300 group-hover:rotate-12" />
                  ) : (
                    <Eye className="h-5 w-5 text-purple-300 group-hover:text-white transition-all duration-300 group-hover:rotate-12" />
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-white/90"
              >
                Account Type
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserCheck className="h-5 w-5 text-purple-300" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white backdrop-blur-sm hover:bg-white/15 appearance-none"
                  required
                >
                  <option value="student" className="bg-gray-800 text-white">
                    Student - Take quizzes and learn
                  </option>
                  <option value="teacher" className="bg-gray-800 text-white">
                    Teacher - Create and manage quizzes
                  </option>
                </select>
                <p className="text-purple-200 text-sm mt-2 opacity-80">
                  Choose your role to access appropriate features
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl hover:shadow-2xl relative overflow-hidden group"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating account...</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Create Account</span>
                </div>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-6 border-t border-white/10">
              <p className="text-purple-200">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-white hover:text-purple-200 transition-all duration-300 underline decoration-purple-400 underline-offset-4 hover:decoration-white hover:scale-105 inline-block"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p
            className="text-purple-300 text-sm flex items-center justify-center space-x-2 animate-fade-in-up"
            style={{ animationDelay: "1s" }}
          >
            <Shield className="h-4 w-4 animate-pulse" />
            <span>Protected by enterprise-grade security</span>
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Register;
