import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
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
        <input type="file" onChange={onFileChange} />
        <button type="submit" disabled={isLoading}>{isLoading ? 'Uploading...' : 'Upload'}</button>
      </form>
    </div>
  );
}

export default FileUpload;
