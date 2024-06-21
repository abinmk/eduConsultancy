import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [examType, setExamType] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onExamTypeChange = (event) => {
    setExamType(event.target.value);
  };

  const onIdentifierChange = (event) => {
    setIdentifier(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!file || !examType || !identifier) {
      alert('Please select an exam type, identifier and file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('datasetName', examType); // Add datasetName to formData
    formData.append('setIdentifier', identifier); // Add setIdentifier to formData
    setIsLoading(true);  // Set loading state to true

    try {
      await axios.post('http://localhost:5001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      setIsLoading(false);  // Reset loading state
    } catch (error) {
      alert('Error uploading file');
      console.error(error);
      setIsLoading(false);  // Reset loading state
    }
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Exam Type:</label>
          <select value={examType} onChange={onExamTypeChange}>
            <option value="">Select Exam Type</option>
            <option value="NEET-PG-ALL-INDIA">NEET-PG-ALL-INDIA</option>
            <option value="NEET-PG-STATE">NEET-PG-STATE</option>
            <option value="INI-CET">INI-CET</option>
            <option value="NEET-SS">NEET-SS</option>
            {/* Add other exam types as needed */}
          </select>
        </div>
        <div>
          <label>Identifier:</label>
          <select value={identifier} onChange={onIdentifierChange}>
            <option value="">Select Identifier</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            {/* Add other identifiers as needed */}
          </select>
        </div>
        <div>
          <input type="file" onChange={onFileChange} />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

export default FileUpload;
