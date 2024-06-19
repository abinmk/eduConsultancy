const multer = require('multer');
const path = require('path');
const readExcelFile = require('read-excel-file/node');
const Result = require('../models/Result');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')  // Ensure this directory exists
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage }).single('file');

exports.handleFileUpload = (req, res) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError || err) {
            return res.status(500).send({ message: err.message });
        }

        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        readExcelFile(filePath).then(rows => {
            rows.shift();  // Assuming first row is header
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

            Result.insertMany(results)
            .then(() => res.send('Data has been successfully saved to MongoDB.'))
            .catch(err => {
                console.error('MongoDB insertion error:', err);
                res.status(500).send('Failed to insert data into MongoDB');
            });
        }).catch(err => {
            console.error('Error reading Excel file:', err);
            res.status(500).send('Failed to process file');
        });
    });
};
