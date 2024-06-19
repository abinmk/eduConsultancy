import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Allotments.css';
import Layout from '../components/Layout';
import ReactPaginate from 'react-paginate';



const Allotments = () => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        quota: '',
        institute: '',
        course: '',
        allottedCategory:'',
        candidateCategory:''
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
      const fetchFilterOptions = async () => {
          try {
              const response = await axios.get('http://localhost:5001/api/filter-options');
              setFilters(prevFilters => ({
                  ...prevFilters,
                  quotas: response.data.quotas,
                  institutes: response.data.institutes,
                  courses: response.data.courses,
                  allottedCategory:response.allottedCategory,
                  candidateCategory:response.candidateCategory
              }));
          } catch (error) {
              console.error('Error fetching filter options:', error);
          }
      };
    
      fetchFilterOptions();
    }, []);
    

    const fetchData = async (page = 1) => {
      setLoading(true);
      try {
          const response = await axios.get('http://localhost:5001/api/allotment-data', {
              params: {
                  page,
                  limit: itemsPerPage,
                  ...filters
              }
          });
          setData(response.data.data);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage - 1);
      } catch (error) {
          console.error('Error fetching data:', error);
      } finally {
          setLoading(false);
      }
  };
  
    useEffect(() => {
        fetchData();
    }, [filters, currentPage]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handlePageClick = (event) => {
        fetchData(event.selected + 1);
    };

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
                                <select name="quota" value={filters.quota} onChange={handleFilterChange}>
                                    <option value="">Select Quota</option>
                                    {/* Dynamically generate options based on available quotas */}
                                </select>
                                <select name="institute" value={filters.institute} onChange={handleFilterChange}>
                                    <option value="">Select Institute</option>
                                    {/* Dynamically generate options based on available institutes */}
                                </select>
                                <select name="course" value={filters.course} onChange={handleFilterChange}>
                                    <option value="">Select Course</option>
                                    {/* Dynamically generate options based on available courses */}
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
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.rank}</td>
                                        <td>{item.allottedQuota}</td>
                                        <td>{item.allottedInstitute}</td>
                                        <td>{item.course}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <ReactPaginate
                            previousLabel={"previous"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={totalPages}
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
