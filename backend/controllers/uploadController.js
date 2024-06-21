// const multer = require('multer');
// const path = require('path');
// const readExcelFile = require('read-excel-file/node');
// const mongoose = require('mongoose');
// const fs = require('fs');

// // Ensure uploads directory exists
// const uploadDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage }).single('file');

// exports.handleFileUpload = (req, res) => {
//     const { datasetName, setIdentifier, round, year } = req.body;

//     if (!datasetName || !setIdentifier || !round || !year) {
//         return res.status(400).send({ message: 'datasetName, setIdentifier, round, and year are required.' });
//     }

//     upload(req, res, function(err) {
//         if (err instanceof multer.MulterError || err) {
//             return res.status(500).send({ message: err.message });
//         } else if (err) {
//             return res.status(500).send({ message: err.message });
//         }

//         const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
//         readExcelFile(filePath).then(rows => {
//             rows.shift(); // Assuming first row is header
//             const results = rows.map(row => ({
//                 rank: row[1],
//                 allottedQuota: row[2],
//                 allottedInstitute: row[3],
//                 course: row[4],
//                 allottedCategory: row[5],
//                 candidateCategory: row[6],
//                 datasetName: datasetName,
//                 setIdentifier: setIdentifier,
//                 round: round,
//                 year: year
//             }));

//             const collectionName = `${datasetName}_Round${round}`;
//             const RoundModel = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));

//             RoundModel.insertMany(results)
//                 .then(() => res.send('Data has been successfully saved to MongoDB.'))
//                 .catch(err => {
//                     console.error('MongoDB insertion error:', err);
//                     res.status(500).send('Failed to insert data into MongoDB');
//                 });
//         }).catch(err => {
//             console.error('Error reading Excel file:', err);
//             res.status(500).send('Failed to process file');
//         });
//     });
// };
