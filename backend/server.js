const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://rankseatsbucket.s3-website-ap-southeast-2.amazonaws.com', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(express.json());

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
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

