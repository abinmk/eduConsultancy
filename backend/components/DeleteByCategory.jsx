import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleDelete = () => {
    axios.post('/api/delete-by-category', { category: selectedCategory })
      .then(response => {
        setMessage(response.data.notice);
      })
      .catch(error => {
        console.error('Error deleting by category:', error);
        setMessage('Failed to delete by category.');
      });
  };

  return (
    <div>
      <h2>Delete By Category</h2>
      <select onChange={e => setSelectedCategory(e.target.value)} value={selectedCategory}>
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <button onClick={handleDelete}>Delete</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteByCategory;
