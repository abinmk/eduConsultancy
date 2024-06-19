const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const port = process.env.PORT || 5001;

// Setup CORS with specific options
app.use(cors({
    origin: 'http://localhost:3000', // or specify your frontend URL
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

// Setup route handlers
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);  // Base path for all upload routes

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
