const express = require('express');
const uploadController = require('../controllers/uploadController');
const Result = require('../models/Result'); // Ensure you import your Result model
const router = express.Router();

// POST route for file uploads
router.post('/upload', uploadController.handleFileUpload);

// GET route for fetching allotment data
router.get('/allotment-data', async (req, res) => {
    try {
        const data = await Result.find({});
        const quotas = [...new Set(data.map(item => item.allottedQuota))];
        const institutes = [...new Set(data.map(item => item.allottedInstitute))];
        const courses = [...new Set(data.map(item => item.course))];
        res.json({ data, quotas, institutes, courses });
    } catch (error) {
        console.error('Failed to fetch data:', error);
        res.status(500).json({ message: 'Failed to fetch data', error: error.message });
    }
});

module.exports = router;
