const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    serialNumber: Number,
    rank: Number,
    allottedQuota: String,
    allottedInstitute: String,
    course: String,
    allottedCategory: String,
    candidateCategory: String,
    remarks: String
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
