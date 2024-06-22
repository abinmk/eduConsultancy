const mongoose = require('mongoose');

const selectedDatasetSchema = new mongoose.Schema({
  selectedDataset: { type: String, required: true }
});

const SelectedDataset = mongoose.model('SelectedDataset', selectedDatasetSchema);

module.exports = SelectedDataset;
