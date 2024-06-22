const mongoose = require('mongoose');

exports.listGeneratedOutputs = async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const generatedOutputs = collections
            .filter(col => col.name.startsWith('GENERATED_'))
            .map(col => col.name);
        res.json({ generatedOutputs });
    } catch (error) {
        console.error('Error listing generated outputs:', error);
        res.status(500).send('Failed to list generated outputs.');
    }
};

exports.setDefaultGeneratedOutput = async (req, res) => {
    try {
        const { outputName } = req.body;
        if (!outputName) {
            return res.status(400).send({ message: 'Output name is required.' });
        }
        // Save the default output name to a config collection or environment variable
        await mongoose.connection.db.collection('config').updateOne(
            { key: 'defaultGeneratedOutput' },
            { $set: { value: outputName } },
            { upsert: true }
        );
        res.send({ message: `Default generated output set to ${outputName}` });
    } catch (error) {
        console.error('Error setting default generated output:', error);
        res.status(500).send('Failed to set default generated output.');
    }
};

exports.getDefaultGeneratedOutput = async (req, res) => {
    try {
        const config = await mongoose.connection.db.collection('config').findOne({ key: 'defaultGeneratedOutput' });
        const defaultGeneratedOutput = config ? config.value : null;
        res.json({ defaultGeneratedOutput });
    } catch (error) {
        console.error('Error fetching default generated output:', error);
        res.status(500).send('Failed to fetch default generated output.');
    }
};

exports.getFilterOptions = async (req, res) => {
    try {
        const config = await mongoose.connection.db.collection('config').findOne({ key: 'defaultGeneratedOutput' });
        const defaultGeneratedOutput = config ? config.value : null;
        if (!defaultGeneratedOutput) {
            return res.status(400).send({ message: 'Default generated output is not set.' });
        }

        const model = mongoose.model(defaultGeneratedOutput);
        const quotas = await model.distinct('allottedQuota');
        const institutes = await model.distinct('allottedInstitute');
        const courses = await model.distinct('course');
        const allottedCategories = await model.distinct('allottedCategory');
        const candidateCategories = await model.distinct('candidateCategory');

        res.json({ quotas, institutes, courses, allottedCategories, candidateCategories });
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).send('Failed to fetch filter options.');
    }
};
