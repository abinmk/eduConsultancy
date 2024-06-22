const mongoose = require('mongoose');

const generatedDatasetSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  displayName: { type: String, required: true },
  includeInAllotments: { type: Boolean, default: false }
});

module.exports = mongoose.model('GeneratedDataset', generatedDatasetSchema);
