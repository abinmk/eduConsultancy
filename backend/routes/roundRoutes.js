const express = require('express');
const router = express.Router();
const roundController = require('../controllers/roundController');

router.post('/upload', roundController.handleFileUpload);
router.post('/upload-course-details', roundController.uploadCourseDetails);
router.get('/available-datasets', roundController.listAvailableDataSets);
router.post('/generate', roundController.generateCombinedResults);
router.get('/categories', roundController.listCategories);

module.exports = router;
