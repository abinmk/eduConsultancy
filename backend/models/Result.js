const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  rank: { type: Number, required: true },
  allottedQuota: { type: String, required: true },
  allottedInstitute: { type: String, required: true },
  course: { type: String, required: true },
  allottedCategory:{ type: String, required: true },
  candidateCategory:{ type: String, required: true },
  // Add other fields as necessary
}, { timestamps: true });

resultSchema.index({ rank: 1 }); // Index on rank to ensure efficient ordering and retrieval

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;
