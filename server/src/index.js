require('dotenv').config();
const connectDB = require('./config/db');



const seedAdmin = require('./seedAdmin');
connectDB().then(() => seedAdmin());

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
const adminRoutes = require('./routes/admin');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});


app.set('io', io);


const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};
console.log('CORS config:', corsOptions);
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log('Incoming cookies:', req.headers.cookie);
  next();
});
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);


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

  socket.join(socket.user.msisdn);

  socket.on('error', (error) => {
  error('Socket error:', error);
  });

  socket.on('disconnect', () => {
  log(`Client disconnected: ${socket.user.msisdn}`);
  });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


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
  console.log(`Server running on port ${PORT}`); 
});
