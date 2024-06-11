import React, { useState, useEffect } from 'react';
import '../styles/Allotments.css';
import Layout from '../components/Layout';

const Allotments = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    rankMin: '',
    rankMax: '',
    quota: '',
    institute: '',
    course: ''
  });
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetch('/allotments.json')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data); // Debug log
        setData(data);
        setFilteredData(data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  const uniqueValues = (key) => {
    const values = [...new Set(data.map(item => item[key]))];
    console.log(`Unique values for ${key}:`, values); // Debug log
    return values;
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    setFilteredData(
      data.filter(item =>
        (filters.rankMin === '' || item.Rank >= parseInt(filters.rankMin)) &&
        (filters.rankMax === '' || item.Rank <= parseInt(filters.rankMax)) &&
        (filters.quota === '' || item['Allotted Quota'] === filters.quota) &&
        (filters.institute === '' || item['Allotted Institute'] === filters.institute) &&
        (filters.course === '' || item.Course === filters.course)
      )
    );
  }, [filters, data]);

  return (
    <Layout>
      <section className="allotments-section">
        <h1>Allotments Filter</h1>
        <p>Details about the allotments will be displayed here.</p>

        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <>
            <div className="filter-section">
              <div className="filter-row">
                <input
                  type="number"
                  name="rankMin"
                  placeholder="Min Rank"
                  value={filters.rankMin}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="rankMax"
                  placeholder="Max Rank"
                  value={filters.rankMax}
                  onChange={handleChange}
                />
              </div>
              <div className="filter-row">
                <select name="quota" value={filters.quota} onChange={handleChange}>
                  <option value="">Select Quota</option>
                  {uniqueValues('Allotted Quota').map((quota, index) => (
                    <option key={index} value={quota}>{quota}</option>
                  ))}
                </select>
                <select name="institute" value={filters.institute} onChange={handleChange}>
                  <option value="">Select Institute</option>
                  {uniqueValues('Allotted Institute').map((institute, index) => (
                    <option key={index} value={institute}>{institute}</option>
                  ))}
                </select>
              </div>
              <div className="filter-row">
                <select name="course" value={filters.course} onChange={handleChange}>
                  <option value="">Select Course</option>
                  {uniqueValues('Course').map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Allotted Quota</th>
                  <th>Allotted Institute</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td data-label="Rank">{item.Rank}</td>
                    <td data-label="Allotted Quota">{item['Allotted Quota']}</td>
                    <td data-label="Allotted Institute">{item['Allotted Institute']}</td>
                    <td data-label="Course">{item.Course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </Layout>
  );
};

export default Allotments;
