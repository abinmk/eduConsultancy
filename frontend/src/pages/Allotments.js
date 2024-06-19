import React, { useState, useEffect } from 'react';
import '../styles/Allotments.css';
import Layout from '../components/Layout';
import ReactPaginate from 'react-paginate';

const Allotments = () => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({
    quotas: [],
    institutes: [],
    courses: []
  });
  const [filters, setFilters] = useState({
    rankMin: '',
    rankMax: '',
    quota: '',
    institute: '',
    course: ''
  });
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
          const response = await fetch('http://localhost:5001/api/allotment-data');
          if (!response.ok) {
              throw new Error('Network response was not ok: ' + await response.text());
          }
          const data = await response.json();
          setData(data);
          setFilteredData(data);
          setCurrentPage(0);
      } catch (error) {
          console.error('Error fetching data:', error.message || error);
      } finally {
          setLoading(false);
      }
  };  

    fetchData();
  }, []);

  // Filter data based on user inputs
  useEffect(() => {
    const filtered = data.filter(item =>
      (filters.rankMin === '' || item.Rank >= parseInt(filters.rankMin)) &&
      (filters.rankMax === '' || item.Rank <= parseInt(filters.rankMax)) &&
      (filters.quota === '' || item['Allotted Quota'] === filters.quota) &&
      (filters.institute === '' || item['Allotted Institute'] === filters.institute) &&
      (filters.course === '' || item.Course === filters.course)
    );
    setFilteredData(filtered);
    setCurrentPage(0);
  }, [filters, data]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Layout>
      <section className="allotments-section">
        <h1>Allotments</h1>
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
                <select name="quota" value={filters.quota} onChange={handleChange}>
                  <option value="">Select Quota</option>
                  {options.quotas.map((quota, index) => (
                    <option key={index} value={quota}>{quota}</option>
                  ))}
                </select>
                <select name="institute" value={filters.institute} onChange={handleChange}>
                  <option value="">Select Institute</option>
                  {options.institutes.map((institute, index) => (
                    <option key={index} value={institute}>{institute}</option>
                  ))}
                </select>
                <select name="course" value={filters.course} onChange={handleChange}>
                  <option value="">Select Course</option>
                  {options.courses.map((course, index) => (
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
                {currentPageData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Rank}</td>
                    <td>{item['Allotted Quota']}</td>
                    <td>{item['Allotted Institute']}</td>
                    <td>{item.Course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          </>
        )}
      </section>
    </Layout>
  );
};

export default Allotments;
