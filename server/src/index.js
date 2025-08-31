require('dotenv').config();
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const { log, error } = require('./utils/logger');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const subscriptionRoutes = require('./routes/subscriptions');
const transactionRoutes = require('./routes/transactions');
const userRoutes = require('./routes/user');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Make io instance available to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/user', userRoutes);

// Socket.IO connection handling with authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  log(`Client connected: ${socket.user.msisdn}`);

  // Join user-specific room for targeted events
  socket.join(socket.user.msisdn);

  socket.on('error', (error) => {
  error('Socket error:', error);
  });

  socket.on('disconnect', () => {
  log(`Client disconnected: ${socket.user.msisdn}`);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  error(err.stack);

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Keep startup log always
});
