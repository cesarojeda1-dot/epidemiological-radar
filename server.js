require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const radarRoutes = require('./routes/radar');
const governmentRoutes = require('./routes/government');
const veterinaryRoutes = require('./routes/veterinary');
const b2b2cRoutes = require('./routes/b2b2c');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ghsentinel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ MongoDB connected'))
.catch(err => console.error('✗ MongoDB connection error:', err));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/radar', radarRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/veterinary', veterinaryRoutes);
app.use('/api/b2b2c', b2b2cRoutes);
app.use('/api/analytics', analyticsRoutes);

// WebSocket Connection for Real-time Updates
io.on('connection', (socket) => {
  console.log(`✓ Client connected: ${socket.id}`);
  
  // Subscribe to radar updates
  socket.on('subscribe-radar', (country) => {
    socket.join(`radar-${country}`);
    console.log(`✓ User subscribed to radar-${country}`);
  });
  
  // Subscribe to veterinary network updates
  socket.on('subscribe-veterinary', (region) => {
    socket.join(`veterinary-${region}`);
    console.log(`✓ User subscribed to veterinary-${region}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`✗ Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║   GHSentinel - Epidemiological Radar  ║
║   Server running on port ${PORT}        ║
║   Environment: ${process.env.NODE_ENV || 'development'}         ║
╚══════════════════════════════════════╝
  `);
});

module.exports = { app, io };
