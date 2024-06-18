const express = require('express');
const cors = require('cors');
const multer = require('multer');
const readExcelFile = require('read-excel-file/node');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

// CORS configuration for handling requests from your frontend
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

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')  // ensure this folder exists
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  readExcelFile(filePath).then((rows) => {
    // Process rows, for example inserting them into MongoDB
    console.log(rows);  // Output the rows to see the data structure
    // You would typically process and maybe store these rows here
    res.send('File uploaded and processed successfully');
  }).catch(err => {
    console.error(err);
    res.status(500).send('Failed to process file');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
