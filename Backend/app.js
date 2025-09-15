
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Quote = require('./models/Quote');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://sih-l58itpb1e-vaibhav-patels-projects-c7ef59ce.vercel.app'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Store login attempts (in production, use Redis or database)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 2;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
}

// Middleware to check if user is a teacher
function requireTeacher(req, res, next) {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Access denied. Teacher role required.' });
  }
  next();
}

// Middleware to check if user is a student
function requireStudent(req, res, next) {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access denied. Student role required.' });
  }
  next();
}

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});


app.post('/auth/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered. Please use a different email or login.' });
    }
    
    // Validate role
    if (role && !['teacher', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be either teacher or student.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      role: role || 'student' 
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  const attemptKey = `${email}-${clientIP}`;
  
  try {
    // Check if user is locked out
    const attempts = loginAttempts.get(attemptKey);
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);
        return res.status(429).json({ 
          error: `Too many failed attempts. Please try again in ${remainingTime} minutes.`,
          attemptsLeft: 0,
          lockedUntil: new Date(attempts.lastAttempt + LOCKOUT_DURATION)
        });
      } else {
        // Reset attempts after lockout period
        loginAttempts.delete(attemptKey);
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Record failed attempt
      const currentAttempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
      currentAttempts.count += 1;
      currentAttempts.lastAttempt = Date.now();
      loginAttempts.set(attemptKey, currentAttempts);
      
      return res.status(400).json({ 
        error: 'User not found',
        attemptsLeft: MAX_ATTEMPTS - currentAttempts.count
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Record failed attempt
      const currentAttempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
      currentAttempts.count += 1;
      currentAttempts.lastAttempt = Date.now();
      loginAttempts.set(attemptKey, currentAttempts);
      
      const attemptsLeft = MAX_ATTEMPTS - currentAttempts.count;
      if (attemptsLeft <= 0) {
        return res.status(429).json({ 
          error: `Too many failed attempts. Please try again in ${Math.ceil(LOCKOUT_DURATION / 1000 / 60)} minutes.`,
          attemptsLeft: 0,
          lockedUntil: new Date(Date.now() + LOCKOUT_DURATION)
        });
      }
      
      return res.status(400).json({ 
        error: 'Invalid credentials',
        attemptsLeft: attemptsLeft
      });
    }

    // Successful login - clear attempts
    loginAttempts.delete(attemptKey);
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Profile routes
app.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({
      ...user?.profile,
      username: user?.username,
      email: user?.email,
      role: user?.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user.userId, { profile: { name, bio, avatar } }, { new: true });
    res.json(user?.profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Quiz routes
app.post('/quiz', auth, requireTeacher, async (req, res) => {
  try {
    console.log('Quiz creation request:', req.body);
    console.log('User ID:', req.user.userId);
    console.log('User role:', req.user.role);
    
    const quiz = new Quiz({ ...req.body, createdBy: req.user.userId });
    await quiz.save();
    console.log('Quiz saved successfully:', quiz);
    res.status(201).json(quiz);
  } catch (err) {
    console.error('Quiz creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/quiz', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit quiz attempt
app.post('/quiz/:id/attempt', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const userId = req.user.userId;
    const userAttempts = quiz.attempts.filter(attempt => 
      attempt.userId.toString() === userId.toString()
    );

    // Check if user has already attempted 2 times
    if (userAttempts.length >= 2) {
      return res.status(429).json({ 
        error: 'You have already used all 2 attempts for this quiz',
        attemptsUsed: userAttempts.length,
        maxAttempts: 2
      });
    }

    const { answers } = req.body;
    if (!answers || answers.length !== quiz.questions.length) {
      return res.status(400).json({ error: 'Invalid answers provided' });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        score++;
      }
    });

    // Save attempt
    const newAttempt = {
      userId: userId,
      score: score,
      totalQuestions: quiz.questions.length,
      answers: answers,
      attemptedAt: new Date()
    };

    quiz.attempts.push(newAttempt);
    await quiz.save();

    res.json({
      score: score,
      totalQuestions: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      attemptNumber: userAttempts.length + 1,
      attemptsRemaining: 2 - (userAttempts.length + 1)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's attempts for a quiz
app.get('/quiz/:id/attempts', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const userId = req.user.userId;
    const userAttempts = quiz.attempts.filter(attempt => 
      attempt.userId.toString() === userId.toString()
    );

    res.json({
      attempts: userAttempts,
      attemptsUsed: userAttempts.length,
      attemptsRemaining: 2 - userAttempts.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all student progress for teachers
app.get('/admin/student-progress', auth, requireTeacher, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'username email');
    
    // Get all attempts with user details
    const progressData = [];
    
    for (const quiz of quizzes) {
      const quizAttempts = quiz.attempts.map(attempt => ({
        quizId: quiz._id,
        quizTitle: quiz.title,
        quizCreatedBy: quiz.createdBy?.username || 'Unknown',
        userId: attempt.userId,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: Math.round((attempt.score / attempt.totalQuestions) * 100),
        attemptedAt: attempt.attemptedAt,
        attemptNumber: quiz.attempts.filter(a => a.userId.toString() === attempt.userId.toString()).indexOf(attempt) + 1
      }));
      
      progressData.push(...quizAttempts);
    }
    
    // Get user details for each attempt
    const userIds = [...new Set(progressData.map(attempt => attempt.userId))];
    const users = await User.find({ _id: { $in: userIds } }, 'username email role');
    
    // Combine progress data with user details
    const enrichedProgress = progressData.map(attempt => {
      const user = users.find(u => u._id.toString() === attempt.userId.toString());
      return {
        ...attempt,
        studentName: user?.username || 'Unknown',
        studentEmail: user?.email || 'Unknown',
        studentRole: user?.role || 'student'
      };
    });
    
    // Sort by attempted date (newest first)
    enrichedProgress.sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt));
    
    res.json(enrichedProgress);
  } catch (err) {
    console.error('Student progress error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get quiz statistics for teachers
app.get('/admin/quiz-stats', auth, requireTeacher, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'username');
    
    const quizStats = quizzes.map(quiz => {
      const attempts = quiz.attempts;
      const uniqueStudents = new Set(attempts.map(attempt => attempt.userId.toString()));
      
      const avgScore = attempts.length > 0 
        ? attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalQuestions), 0) / attempts.length
        : 0;
      
      return {
        quizId: quiz._id,
        quizTitle: quiz.title,
        totalQuestions: quiz.questions.length,
        totalAttempts: attempts.length,
        uniqueStudents: uniqueStudents.size,
        averageScore: Math.round(avgScore * 100),
        createdBy: quiz.createdBy?.username || 'Unknown',
        createdAt: quiz.createdAt
      };
    });
    
    res.json(quizStats);
  } catch (err) {
    console.error('Quiz stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Quote routes
app.get('/quote', async (req, res) => {
  try {
    const today = new Date();
    const quote = await Quote.findOne({
      date: {
        $gte: new Date(today.setHours(0,0,0,0)),
        $lt: new Date(today.setHours(23,59,59,999))
      }
    });
    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/quote', async (req, res) => {
  try {
    const quote = new Quote(req.body);
    await quote.save();
    res.status(201).json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
