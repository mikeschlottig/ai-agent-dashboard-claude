require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic Middleware
app.use(cors({ origin: process.env.CORS_ORIGINS || '*' }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AI Agent Dashboard API' });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

module.exports = app;
