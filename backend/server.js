const express = require('express');
const cors = require('cors');
const multer = require('multer');
const readExcelFile = require('read-excel-file/node');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5001;

// Set up Multer
const upload = multer({ dest: 'uploads/' });

app.use(cors({
  origin: 'http://rankseatsbucket.s3-website-ap-southeast-2.amazonaws.com', // Frontend URL
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

const Result = require('./models/Result'); // Assuming you named the model as Result

// Define routes after all middleware is set up
app.use('/api/auth', require('./routes/auth'));

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const filePath = req.file.path;
  readExcelFile(filePath).then((rows) => {
    rows.shift(); // Assuming the first row is headers
    const results = rows.map(row => ({
      serialNumber: row[0],
      rank: row[1],
      allottedQuota: row[2],
      allottedInstitute: row[3],
      course: row[4],
      allottedCategory: row[5],
      candidateCategory: row[6],
      remarks: row[7]
    }));
    Result.insertMany(results)  // Using insertMany for bulk insertion
      .then(() => res.send('Excel file processed and data added to MongoDB'))
      .catch(err => {
        res.status(500).send('Failed to process Excel file');
        console.error(err);
      });
  }).catch(err => {
    res.status(500).send('Error reading Excel file');
    console.error(err);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
