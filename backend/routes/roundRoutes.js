const express = require('express');
const router = express.Router();
const { handleFileUpload,getSelectedDataset,updateSelectedDataset,getAllotmentData,getFilterOptions, uploadCourseDetails, uploadCollegeDetails, listAvailableDataSets, deleteDataset, generateCombinedResults, listCategories, deleteByCategory } = require('../controllers/roundController');

// Define your routes here
router.post('/upload', handleFileUpload);
router.post('/upload-course-details', uploadCourseDetails);
router.post('/upload-college-details', uploadCollegeDetails);
router.get('/available-datasets', listAvailableDataSets);
router.delete('/delete-dataset', deleteDataset);
router.post('/generate', generateCombinedResults);
router.get('/categories', listCategories);
router.post('/delete-category', deleteByCategory);
router.get('/allotment-data', getAllotmentData);
router.get('/filter-options', getFilterOptions);
router.get('/selected-dataset', getSelectedDataset);
router.put('/selected-dataset', updateSelectedDataset);

module.exports = router;
