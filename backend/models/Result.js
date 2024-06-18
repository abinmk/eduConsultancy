const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a course
const courseSchema = new Schema({
  collegeName: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true,
    unique: true // Assuming each course name is unique
  },
  fees: {
    type: Number,
    required: true
  },
  courseType: {
    type: String,
    required: false // Optional field
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Compile the schema into a model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
