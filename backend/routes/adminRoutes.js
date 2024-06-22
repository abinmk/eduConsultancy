// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const SelectedDataset = require('../models/SelectedDataset');

// Update the selected dataset
router.put('/selected-dataset', async (req, res) => {
  try {
    const { selectedDataset } = req.body;
    if (!selectedDataset) {
      return res.status(400).json({ message: 'Selected dataset is required' });
    }

    // Update or create the selected dataset
    let dataset = await SelectedDataset.findOne();
    if (dataset) {
      dataset.selectedDataset = selectedDataset;
    } else {
      dataset = new SelectedDataset({ selectedDataset });
    }
    await dataset.save();

    res.json(dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the selected dataset
router.get('/selected-dataset', async (req, res) => {
  try {
    const dataset = await SelectedDataset.findOne();
    res.json(dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
