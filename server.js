require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const app = express();

// Connect to database first
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/content', require('./routes/content'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/comments', require('./routes/comments'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Add this error handler at the end of app.js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});