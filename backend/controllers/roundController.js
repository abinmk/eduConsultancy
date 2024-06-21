const mongoose = require('mongoose');
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

const upload = multer({ storage: storage }).single('file');

exports.handleFileUpload = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(500).send({ message: err.message });
    }

    const { examName, round, year } = req.body;
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const collectionName = `${examName}_${year}_${round}`;
    const schema = new mongoose.Schema({}, { strict: false });
    const RoundModel = mongoose.model(collectionName, schema, collectionName);

    readExcelFile(filePath).then((rows) => {
      rows.shift();
      const results = rows.map((row) => ({
        rank: row[0],
        allottedQuota: row[1],
        allottedInstitute: row[2],
        course: row[3],
        allottedCategory: row[4],
        candidateCategory: row[5],
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
    const CourseModel = mongoose.model('courses', new mongoose.Schema({}, { strict: false }), 'courses');

    readExcelFile(filePath).then((rows) => {
      rows.shift();
      const courses = rows.map((row) => ({
        course: row[0],
        courseCode: row[1],
        duration: row[2],
        courseCategory: row[3],
        courseType: row[4],
        degreeType: row[5],
        description: row[6],
      }));

      CourseModel.insertMany(courses)
        .then(() => res.send('Course details have been successfully saved to MongoDB.'))
        .catch((err) => {
          console.error('MongoDB insertion error:', err);
          res.status(500).send('Failed to insert course details into MongoDB');
        });
    }).catch((err) => {
      console.error('Error reading Excel file:', err);
      res.status(500).send('Failed to process file');
    });
  });
};

exports.listAvailableDataSets = async (req, res) => {
  const { examName, year } = req.query;
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const filteredCollections = collections.filter(col => col.name.startsWith(`${examName}_${year}_`));
    const dataSets = filteredCollections.map(col => col.name);
    res.json({ availableDataSets: dataSets });
  } catch (err) {
    console.error('Error fetching available datasets:', err);
    res.status(500).send('Failed to fetch available datasets.');
  }
};

exports.generateCombinedResults = async (req, res) => {
  try {
    const { examName, resultName, year, selectedDataSets } = req.body;

    if (!examName || !resultName || !year || !selectedDataSets || selectedDataSets.length === 0) {
      return res.status(400).send({ message: 'examName, resultName, year, and selectedDataSets are required.' });
    }

    const combinedCollectionName = `${examName}_RESULT_${resultName}`;
    const schema = new mongoose.Schema({}, { strict: false });
    const CombinedModel = mongoose.model(combinedCollectionName, schema, combinedCollectionName);

    await CombinedModel.deleteMany({});

    const CourseModel = mongoose.model('courses', new mongoose.Schema({}, { strict: false }), 'courses');
    const courses = await CourseModel.find({}).lean();

    const courseMap = courses.reduce((acc, course) => {
      acc[course.course] = course;
      return acc;
    }, {});

    for (const dataSet of selectedDataSets) {
      const RoundModel = mongoose.model(dataSet, schema, dataSet);
      const roundData = await RoundModel.find({}).lean();

      const enrichedData = roundData.map(data => {
        const courseDetails = courseMap[data.course] || {};
        return {
          ...data,
          ...courseDetails,
          _id: new mongoose.Types.ObjectId() // Ensure a new unique _id for each document
        };
      });

      await CombinedModel.insertMany(enrichedData);
    }

    res.send('Combined results with course details have been successfully generated and saved.');
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
  
