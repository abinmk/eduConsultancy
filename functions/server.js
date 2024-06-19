const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Ensure dotenv is loaded at the top
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const db = process.env.MONGO_URI;
if (!db) {
  console.error('MONGO_URI environment variable is not defined');
  process.exit(1);
}

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with an error code
  });

// Connection status logging
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB Cluster');
});

mongoose.connection.on('error', (error) => {
  console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Routes
app.use('/api/auth', require('./routes/auth'));

// Example of a protected route using roleCheck middleware
const roleCheck = require('./middlewares/roleCheck');
app.use('/admin', roleCheck(['admin']), (req, res) => {
  res.send('Welcome, Admin!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
