// routes/allotmentsRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Fetch allotment data for a specific dataset
router.get('/allotment-data/:dataset', async (req, res) => {
  const { dataset } = req.params;
  const { page = 1, limit = 10, quota, institute, course, allottedCategory, candidateCategory } = req.query;
  const filters = {};

  if (quota) filters.allottedQuota = quota;
  if (institute) filters.allottedInstitute = institute;
  if (course) filters.course = course;
  if (allottedCategory) filters.allottedCategory = allottedCategory;
  if (candidateCategory) filters.candidateCategory = candidateCategory;

  try {
    const model = mongoose.model(dataset);
    const data = await model.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    const totalCount = await model.countDocuments(filters);
    const totalPages = Math.ceil(totalCount / limit);
    res.json({ data, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    console.error('Error fetching allotment data:', error);
    res.status(500).send('Failed to fetch allotment data.');
  }
});

module.exports = router;
