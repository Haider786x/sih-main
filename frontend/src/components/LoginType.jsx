"use client";

import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Sparkles, Users } from "lucide-react";

const LoginType = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
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

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative inline-block">
            {/* Rotating Ring */}
            <div
              className="absolute -inset-2 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-full blur-lg opacity-60 animate-spin"
              style={{ animationDuration: "8s" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 p-4 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-10 w-10 text-white animate-pulse" />
              {/* Sparkle Effects */}
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-ping" />
            </div>
          </div>

          <h1
            className="mt-6 text-4xl font-bold text-white mb-2 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Welcome Back
          </h1>
          <p
            className="text-purple-200 text-lg mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Choose your role to continue
          </p>
        </div>

        <div
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 animate-fade-in-up hover:shadow-3xl hover:bg-white/15"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="space-y-4 mb-8">
            <Link
              to="/login/teacher"
              className="group relative w-full flex items-center justify-center py-4 px-6 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white/10 border border-white/20 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-500 hover:border-purple-400/50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-semibold">Teacher Portal</div>
                  <div className="text-sm text-purple-200 group-hover:text-white transition-colors duration-300">
                    Manage courses & students
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </Link>

            <Link
              to="/login/student"
              className="group relative w-full flex items-center justify-center py-4 px-6 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white/10 border border-white/20 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 hover:border-indigo-400/50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-semibold">Student Portal</div>
                  <div className="text-sm text-purple-200 group-hover:text-white transition-colors duration-300">
                    Access your courses
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </Link>
          </div>

          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-purple-200">
              New to our platform?{" "}
              <Link
                to="/register"
                className="font-semibold text-white hover:text-purple-200 transition-all duration-300 underline decoration-purple-400 underline-offset-4 hover:decoration-white hover:scale-105 inline-block"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

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

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LoginType;
