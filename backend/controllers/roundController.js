const mongoose = require('mongoose');
const Dataset = require('../models/Dataset');
const readExcelFile = require('read-excel-file/node');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const courseSchema = new mongoose.Schema({
    course: String,
    courseCode: String,
    duration: String,
    courseCategory: String,
    courseType: String,
    degreeType: String,
    description: String,
  });
  
  let Course;
  try {
    Course = mongoose.model('courses');
  } catch (error) {
    if (error.name === 'MissingSchemaError') {
      Course = mongoose.model('courses', courseSchema);
    } else {
      throw error;
    }
  }
  

const upload = multer({ storage: storage }).single('file');

exports.handleFileUpload = (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(500).send({ message: err.message });
      }
  
      const { examName, round, year } = req.body;
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      const collectionName = `${examName}_${year}_${round}`;
      const schema = new mongoose.Schema({}, { strict: false });
  
      let RoundModel;
      try {
        RoundModel = mongoose.model(collectionName);
      } catch (error) {
        if (error.name === 'MissingSchemaError') {
          RoundModel = mongoose.model(collectionName, schema, collectionName);
        } else {
          throw error;
        }
      }
  
      // Delete existing documents if any
      try {
        await RoundModel.deleteMany({});
      } catch (error) {
        console.error('Error deleting existing documents:', error);
        return res.status(500).send('Failed to delete existing documents');
      }
  
      readExcelFile(filePath).then((rows) => {
        rows.shift(); // Remove header row
        const results = rows.map((row) => ({
          rank: row[1],
          allottedQuota: row[2],
          allottedInstitute: row[3],
          course: row[4],
          allottedCategory: row[5],
          candidateCategory: row[6],
          examName: examName,
          year: year,
          round: round,
        }));
  
        RoundModel.insertMany(results)
          .then(() => res.send('Data has been successfully saved to MongoDB.'))
          .catch((err) => {
            console.error('MongoDB insertion error:', err);
            res.status(500).send('Failed to insert data into MongoDB');
          });
      }).catch((err) => {
        console.error('Error reading Excel file:', err);
        res.status(500).send('Failed to process file');
      });
    });
  };
  
  exports.uploadCourseDetails = (req, res) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(500).send({ message: err.message });
      }
  
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      const courseSchema = new mongoose.Schema({
        course: String,
        courseCode: String,
        duration: String,
        courseCategory: String,
        courseType: String,
        degreeType: String,
        description: String
      }, { strict: false });
      
      const CourseModel = mongoose.model('Course', courseSchema, 'courses');
  
      readExcelFile(filePath).then((rows) => {
        rows.shift(); // Remove header row
        const courses = rows.map((row) => ({
          course: row[0],
          courseCode: row[1],
          duration: row[2],
          courseCategory: row[3],
          courseType: row[4],
          degreeType: row[5],
          description: row[6]
        }));
  
        CourseModel.insertMany(courses)
          .then(() => res.send('Course details have been successfully saved to MongoDB.'))
          .catch((err) => {
            console.error('MongoDB insertion error:', err);
            res.status(500).send('Failed to insert course details into MongoDB');
          });
      }).catch((err) => {
        console.error('Error reading Excel file:', err);
        res.status(500).send('Failed to process course file');
      });
    });
  };


exports.listAvailableDataSets = async (req, res) => {
    try {
      const { examName, year } = req.query;
      const collections = await mongoose.connection.db.listCollections().toArray();
      const datasets = collections
        .filter(col => col.name.startsWith(`${examName}_${year}`))
        .map(col => col.name);
      res.json({ availableDataSets: datasets });
    } catch (error) {
      console.error('Error listing available datasets:', error);
      res.status(500).send('Failed to list available datasets.');
    }
  };
  

  
  exports.deleteDataset = async (req, res) => {
    const { datasetName } = req.body;
    try {
      if (!datasetName) {
        return res.status(400).send({ message: 'Dataset name is required.' });
      }
      const result = await mongoose.connection.db.collection(datasetName).drop();
      res.send({ message: `Dataset ${datasetName} has been deleted successfully.` });
    } catch (err) {
      console.error('Error deleting dataset:', err);
      res.status(500).send('Failed to delete dataset.');
    }
  };

  exports.generateCombinedResults = async (req, res) => {
    try {
      const { examName, resultName, year, selectedDataSets } = req.body;
  
      if (!examName || !resultName || !year || !selectedDataSets || selectedDataSets.length === 0) {
        return res.status(400).send({ message: 'examName, resultName, year, and selectedDataSets are required.' });
      }
  
      const combinedCollectionName = `${"GENERATED"}_${examName}_${resultName}`;
      if (await mongoose.connection.db.listCollections({ name: combinedCollectionName }).hasNext()) {
        console.log(`Deleting existing collection: ${combinedCollectionName}`);
        await mongoose.connection.db.dropCollection(combinedCollectionName);
      }
  
      const schema = new mongoose.Schema({}, { strict: false });
      let CombinedModel;
      try {
        CombinedModel = mongoose.model(combinedCollectionName);
      } catch (error) {
        if (error.name === 'MissingSchemaError') {
          CombinedModel = mongoose.model(combinedCollectionName, schema, combinedCollectionName);
        } else {
          throw error;
        }
      }
  
      let CourseModel;
      try {
        CourseModel = mongoose.model('courses');
      } catch (error) {
        if (error.name === 'MissingSchemaError') {
          const courseSchema = new mongoose.Schema({}, { strict: false });
          CourseModel = mongoose.model('courses', courseSchema, 'courses');
        } else {
          throw error;
        }
      }
  
      let CollegeModel;
      try {
        CollegeModel = mongoose.model('colleges');
      } catch (error) {
        if (error.name === 'MissingSchemaError') {
          const collegeSchema = new mongoose.Schema({}, { strict: false });
          CollegeModel = mongoose.model('colleges', collegeSchema, 'colleges');
        } else {
          throw error;
        }
      }
  
      const courses = await CourseModel.find({}).lean();
      const colleges = await CollegeModel.find({}).lean();
  
      const courseMap = courses.reduce((acc, course) => {
        acc[course.course] = course;
        return acc;
      }, {});
  
      const collegeMap = colleges.reduce((acc, college) => {
        acc[college.collegeName] = college;
        return acc;
      }, {});
  
      for (const dataSet of selectedDataSets) {
        let RoundModel;
        try {
          RoundModel = mongoose.model(dataSet);
        } catch (error) {
          if (error.name === 'MissingSchemaError') {
            RoundModel = mongoose.model(dataSet, schema, dataSet);
          } else {
            throw error;
          }
        }
        const roundData = await RoundModel.find({}).lean();
  
        const enrichedData = roundData.map(data => {
          const courseDetails = courseMap[data.course] || {};
          const collegeDetails = collegeMap[data.allottedInstitute] || {};
          return {
            ...data,
            ...courseDetails,
            ...collegeDetails,
            _id: new mongoose.Types.ObjectId() // Ensure a new unique _id for each document
          };
        });
  
        await CombinedModel.insertMany(enrichedData);
      }
  
      res.send('Combined results with course and college details have been successfully generated and saved.');
    } catch (err) {
      console.error('Error generating combined results:', err);
      res.status(500).send('Failed to generate combined results.');
    }
  };
  
  
  
  
  
exports.listCategories = async (req, res) => {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const categories = collections.map(col => {
        const parts = col.name.split('_');
        if (parts.length >= 2) {
          return `${parts[0]}_${parts[1]}`;
        }
        return null;
      }).filter(Boolean);
      res.json([...new Set(categories)]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Failed to fetch categories.');
    }
  };
  
  exports.deleteByCategory = async (req, res) => {
    try {
      const { category } = req.body;
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionsToDelete = collections.filter(col => col.name.startsWith(category));
  
      for (const collection of collectionsToDelete) {
        await mongoose.connection.db.dropCollection(collection.name);
      }
  
      res.send({ notice: `${collectionsToDelete.length} collections deleted successfully.` });
    } catch (error) {
      console.error('Error deleting by category:', error);
      res.status(500).send('Failed to delete collections by category.');
    }
  };
  

  // New endpoint for uploading college details
exports.uploadCollegeDetails = (req, res) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(500).send({ message: err.message });
      } else if (err) {
        return res.status(500).send({ message: err.message });
      }
  
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      const schema = new mongoose.Schema({}, { strict: false });
      const CollegeModel = mongoose.model('colleges', schema, 'colleges');
  
      readExcelFile(filePath).then((rows) => {
        rows.shift();
        const collegeDetails = rows.map((row) => ({
          collegeName: row[0],
          address: row[1],
          city: row[2],
          state: row[3],
          contact: row[4],
          email: row[5],
        }));
  
        CollegeModel.insertMany(collegeDetails)
          .then(() => res.send('College details have been successfully uploaded and saved to MongoDB.'))
          .catch((err) => {
            console.error('MongoDB insertion error:', err);
            res.status(500).send('Failed to insert college details into MongoDB');
          });
      }).catch((err) => {
        console.error('Error reading Excel file:', err);
        res.status(500).send('Failed to process file');
      });
    });
  };

  exports.uploadCollegeDetails = (req, res) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(500).send({ message: err.message });
      }
  
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      const schema = new mongoose.Schema({}, { strict: false });
      let CollegeModel;
      try {
        CollegeModel = mongoose.model('colleges');
      } catch (error) {
        if (error.name === 'MissingSchemaError') {
          CollegeModel = mongoose.model('colleges', schema, 'colleges');
        } else {
          throw error;
        }
      }
  
      readExcelFile(filePath).then((rows) => {
        rows.shift();
        const collegeDetails = rows.map((row) => ({
          collegeName: row[0],
          collegeCode: row[1],
          location: row[2],
          type: row[3],
          affiliation: row[4],
          description: row[5],
        }));
  
        CollegeModel.insertMany(collegeDetails)
          .then(() => res.send('College details have been successfully saved to MongoDB.'))
          .catch((err) => {
            console.error('MongoDB insertion error:', err);
            res.status(500).send('Failed to insert data into MongoDB');
          });
      }).catch((err) => {
        console.error('Error reading Excel file:', err);
        res.status(500).send('Failed to process file');
      });
    });
  };
  
  
