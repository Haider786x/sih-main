import axios from 'axios';

const API_BASE_URL = 'https://sih-besy.onrender.com';

// Quiz API functions
export const quizAPI = {
  // Get all quizzes
  getAllQuizzes: async () => {
    const response = await axios.get(`${API_BASE_URL}/quiz`);
    return response.data;
  },

  // Get quiz by ID
  getQuizById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/quiz/${id}`);
    return response.data;
  },

  // Create new quiz
  createQuiz: async (quizData) => {
    const response = await axios.post(`${API_BASE_URL}/quiz`, quizData);
    return response.data;
  },

  // Submit quiz attempt
  submitQuizAttempt: async (quizId, answers) => {
    const response = await axios.post(`${API_BASE_URL}/quiz/${quizId}/attempt`, {
      answers
    });
    return response.data;
  },

  // Get user's attempts for a quiz
  getUserAttempts: async (quizId) => {
    const response = await axios.get(`${API_BASE_URL}/quiz/${quizId}/attempts`);
    return response.data;
  }
};

// Admin API functions (for teachers)
export const adminAPI = {
  // Get all student progress
  getStudentProgress: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/student-progress`);
    return response.data;
  },

  // Get quiz statistics
  getQuizStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/quiz-stats`);
    return response.data;
  }
};

// Quote API functions
export const quoteAPI = {
  // Get today's quote
  getTodaysQuote: async () => {
    const response = await axios.get(`${API_BASE_URL}/quote`);
    return response.data;
  },

  // Create new quote
  createQuote: async (quoteData) => {
    const response = await axios.post(`${API_BASE_URL}/quote`, quoteData);
    return response.data;
  }
};