// models/College.js
const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  slNo: Number,
  collegeShortName: String,
  collegeAddress: String,
  collegeName: String,
  universityName: String,
  state: String,
  instituteType: String,
  yearOfEstablishment: Number,
  totalHospitalBeds: Number,
  locationMapLink: String,
  nearestRailwayStation: String,
  distanceFromRailwayStation: String,
  nearestAirport: String,
  distanceFromAirport: String,
}, { strict: false });

module.exports = mongoose.model('College', collegeSchema);
