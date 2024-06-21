import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import './FileUpload.css'; // Create a CSS file for styling

function FileUpload() {
    const [file, setFile] = useState(null);
    const [courseFile, setCourseFile] = useState(null);
    const [collegeFile, setCollegeFile] = useState(null); // New state for college file
    const [examName, setExamName] = useState('');
    const [round, setRound] = useState('');
    const [year, setYear] = useState('');
    const [resultName, setResultName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [availableDataSets, setAvailableDataSets] = useState([]);
    const [selectedDataSets, setSelectedDataSets] = useState([]);

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onCourseFileChange = (event) => {
        setCourseFile(event.target.files[0]);
    };

    const onCollegeFileChange = (event) => { // New handler for college file change
        setCollegeFile(event.target.files[0]);
    };

    const onExamNameChange = (event) => {
        setExamName(event.target.value);
        setAvailableDataSets([]);
        setSelectedDataSets([]);
        fetchAvailableDataSets(event.target.value, year);
    };

    const onRoundChange = (event) => {
        setRound(event.target.value);
    };

    const onYearChange = (event) => {
        setYear(event.target.value);
        setAvailableDataSets([]);
        setSelectedDataSets([]);
        fetchAvailableDataSets(examName, event.target.value);
    };

    const onResultNameChange = (event) => {
        setResultName(event.target.value);
    };

    const onSelectedDataSetsChange = (event) => {
        const options = event.target.options;
        const selected = [];
        for (const option of options) {
            if (option.selected) {
                selected.push(option.value);
            }
        }
        setSelectedDataSets(selected);
    };

    const fetchAvailableDataSets = async (exam, year) => {
        if (!exam || !year) return;

        try {
            const response = await axios.get('http://localhost:5001/api/available-datasets', {
                params: { examName: exam, year: year }
            });
            setAvailableDataSets(response.data.availableDataSets);
        } catch (error) {
            console.error('Error fetching available data sets', error);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!file || !examName || !round || !year) {
            alert('Please fill all fields and select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('examName', examName);
        formData.append('round', round);
        formData.append('year', year);
        setIsLoading(true);

        try {
            await axios.post('http://localhost:5001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('File uploaded successfully');
            setIsLoading(false);
            fetchAvailableDataSets(examName, year);
        } catch (error) {
            alert('Error uploading file');
            console.error(error);
            setIsLoading(false);
        }
    };

    const onCourseSubmit = async (event) => {
        event.preventDefault();
        if (!courseFile) {
            alert('Please select a course file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', courseFile);
        setIsLoading(true);

        try {
            await axios.post('http://localhost:5001/api/upload-course-details', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Course file uploaded successfully');
            setIsLoading(false);
        } catch (error) {
            alert('Error uploading course file');
            console.error(error);
            setIsLoading(false);
        }
    };

    const onCollegeSubmit = async (event) => { // New function for handling college details upload
        event.preventDefault();
        if (!collegeFile) {
            alert('Please select a college file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', collegeFile);
        setIsLoading(true);

        try {
            await axios.post('http://localhost:5001/api/upload-college-details', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('College file uploaded successfully');
            setIsLoading(false);
        } catch (error) {
            alert('Error uploading college file');
            console.error(error);
            setIsLoading(false);
        }
    };

    const onGenerateResults = async () => {
        if (!examName || !resultName || !year || selectedDataSets.length === 0) {
            alert('Please fill exam name, result name, year, and select data sets.');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('http://localhost:5001/api/generate', {
                examName,
                resultName,
                year,
                selectedDataSets
            });
            alert('Combined results generated successfully');
            setIsLoading(false);
        } catch (error) {
            alert('Error generating combined results');
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Upload Data</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Exam Name:</label>
                    <select value={examName} onChange={onExamNameChange}>
                        <option value="">Select Exam</option>
                        <option value="NEET_PG_ALL_INDIA">NEET_PG_ALL_INDIA</option>
                        <option value="NEET_PG_STATE">NEET_PG_STATE</option>
                        <option value="INI_CET">INI_CET</option>
                        <option value="NEET_SS">NEET_SS</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Round:</label>
                    <input type="text" value={round} onChange={onRoundChange} />
                </div>
                <div className="form-group">
                    <label>Year:</label>
                    <select value={year} onChange={onYearChange}>
                        <option value="">Select Year</option>
                        {Array.from({ length: 16 }, (_, i) => 2015 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <input type="file" onChange={onFileChange} />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload'}
                </button>
            </form>

            <h1>Upload Course Details</h1>
            <form onSubmit={onCourseSubmit}>
                <div className="form-group">
                    <input type="file" onChange={onCourseFileChange} />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload Course Details'}
                </button>
            </form>

            <h1>Upload College Details</h1> {/* New section for uploading college details */}
            <form onSubmit={onCollegeSubmit}>
                <div className="form-group">
                    <input type="file" onChange={onCollegeFileChange} />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload College Details'}
                </button>
            </form>

            <h1>Generate Combined Results</h1>
            <div className="form-group">
                <label>Exam Name:</label>
                <select value={examName} onChange={onExamNameChange}>
                    <option value="">Select Exam</option>
                    <option value="NEET_PG_ALL_INDIA">NEET_PG_ALL_INDIA</option>
                    <option value="NEET_PG_STATE">NEET_PG_STATE</option>
                    <option value="INI_CET">INI_CET</option>
                    <option value="NEET_SS">NEET_SS</option>
                </select>
            </div>
            <div className="form-group">
                <label>Year:</label>
                <select value={year} onChange={onYearChange}>
                    <option value="">Select Year</option>
                    {Array.from({ length: 16 }, (_, i) => 2015 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Available Data Sets:</label>
                <select multiple value={selectedDataSets} onChange={onSelectedDataSetsChange}>
                    {availableDataSets.map(dataSet => (
                            <option key={dataSet} value={dataSet}>{dataSet}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Result Name:</label>
                        <input type="text" value={resultName} onChange={onResultNameChange} />
                    </div>
                    <button onClick={onGenerateResults} disabled={isLoading}>
                        {isLoading ? 'Generating Results...' : 'Generate Results'}
                    </button>
                </div>
            );
        }
        
        export default FileUpload;
        
        // Ensure to use the new React 18 createRoot API
        const container = document.getElementById('root');
        const root = createRoot(container);
        root.render(<FileUpload />);
        