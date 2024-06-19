const express = require('express');
const multer = require('multer');
const readExcelFile = require('read-excel-file/node');
const Result = require('../models/Result'); // Ensure this is the correct path
const path = require('path');
const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// File upload and processing route
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = `./uploads/${req.file.filename}`;
    try {
        const rows = await readExcelFile(filePath);
        rows.shift(); // Assuming first row is header
        const results = rows.map(row => ({
            rank: row[1],
            allottedQuota: row[2],
            allottedInstitute: row[3],
            course: row[4],
            allottedCategory: row[5],
            candidateCategory: row[6]
        }));

        for (let result of results) {
            await Result.updateOne({ rank: result.rank }, result, { upsert: true });
        }

        res.send('Data uploaded and processed successfully.');
    } catch (error) {
        console.error('Failed to process file', error);
        res.status(500).send('Failed to process file');
    }
});

router.get('/filter-options', async (req, res) => {
    try {
        const quotas = await Result.distinct('allottedQuota');
        const institutes = await Result.distinct('allottedInstitute');
        const courses = await Result.distinct('course');
        res.json({ quotas, institutes, courses });
    } catch (error) {
        console.error('Failed to fetch filter options', error);
        res.status(500).send('Failed to fetch filter options');
    }
});


// Pagination and filtering route
router.get('/allotment-data', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { quota, institute, course ,allottedCategory,candidateCategory} = req.query;
    const query = {};

    if (quota) query.allottedQuota = quota;
    if (institute) query.allottedInstitute = institute;
    if (course) query.course = course;
    if (allottedCategory) query.allottedCategory = allottedCategory;
    if (candidateCategory) query.candidateCategory = candidateCategory;

    try {
        const data = await Result.find(query)
            .sort({ rank: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        const count = await Result.countDocuments(query);
        res.json({ data, totalPages: Math.ceil(count / limit), currentPage: page });
    } catch (error) {
        console.error('Query failed', error);
        res.status(500).json({ message: 'Query failed', error: error.message });
    }
});

module.exports = router;
