import React, { useState, useEffect } from 'react';
import '../styles/Allotments.css';
import Layout from '../components/Layout';
import ReactPaginate from 'react-paginate';

const Allotments = () => {
  const [data, setData] = useState([]);
  const [selectedRound, setSelectedRound] = useState('1'); // Default to Round 1
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    rankMin: '',
    rankMax: '',
    quota: '',
    institute: '',
    course: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const filePath = `/allotments${selectedRound}.json`;
        const response = await fetch(filePath);
        const result = await response.json();
        setData(result);
        setFilteredData(result);
        setCurrentPage(0); // Reset to the first page
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRound]);

  useEffect(() => {
    if (!loading) {
      const filtered = data.filter(item =>
        (filters.rankMin === '' || item.Rank >= parseInt(filters.rankMin)) &&
        (filters.rankMax === '' || item.Rank <= parseInt(filters.rankMax)) &&
        (filters.quota === '' || item['Allotted Quota'] === filters.quota) &&
        (filters.institute === '' || item['Allotted Institute'] === filters.institute) &&
        (filters.course === '' || item.Course === filters.course)
      );
      setFilteredData(filtered);
      setCurrentPage(0);
    }
  }, [filters, data, loading]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleRoundChange = (e) => {
    setSelectedRound(e.target.value);
    setFilters({ rankMin: '', rankMax: '', quota: '', institute: '', course: '' }); // Reset filters on round change
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const uniqueValues = (key) => {
    return [...new Set(data.map(item => item[key]))];
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
                <select id="round" value={selectedRound} onChange={handleRoundChange}>
                  <option value="1">NEET-PG Counselling Seats Allotment - 2023 Round 1</option>
                  {/* <option value="2">NEET-PG Counselling Seats Allotment - 2023 Round 2</option>
                  <option value="3">NEET-PG Counselling Seats Allotment - 2023 Round 3</option> */}
                </select>
              </div>

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
