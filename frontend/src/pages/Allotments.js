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
        candidateCategory:'',
        quotas: [],
        institutes: [],
        courses: [],
        allottedCategory: [],
        candidateCategory: []
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5001/api/allotment-data', {
                params: {
                    page,
                    limit: itemsPerPage,
                    quota: filters.quota,
                    institute: filters.institute,
                    course: filters.course,
                    allottedCategory: filters.allottedCategory,
                    candidateCategory: filters.candidateCategory
                }
            });
            setData(response.data.data || []);
            setTotalPages(response.data.totalPages || 0);
            setCurrentPage((response.data.currentPage || 1) - 1);
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilterOptions = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/filter-options');
            console.log('Filter options response:', response.data); // Log the response
            setFilters(prevFilters => ({
                ...prevFilters,
                quotas: Array.isArray(response.data.quotas) ? response.data.quotas : [],
                institutes: Array.isArray(response.data.institutes) ? response.data.institutes : [],
                courses: Array.isArray(response.data.courses) ? response.data.courses : [],
                allottedCategory: Array.isArray(response.data.allottedCategory) ? response.data.allottedCategory : [],
                candidateCategory: Array.isArray(response.data.candidateCategory) ? response.data.candidateCategory : []
            }));
        } catch (error) {
            console.error('Error fetching filter options:', error);
            setFilters(prevFilters => ({
                ...prevFilters,
                quotas: [],
                institutes: [],
                courses: [],
                allottedCategory: [],
                candidateCategory: []
            }));
        }
    };

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        fetchData(currentPage + 1);
    }, [filters, currentPage]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
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
                                    {filters.quotas.map((quota, index) => (
                                        <option key={index} value={quota}>{quota}</option>
                                    ))}
                                </select>
                                <select name="institute" value={filters.institute} onChange={handleFilterChange}>
                                    <option value="">Select Institute</option>
                                    {filters.institutes.map((institute, index) => (
                                        <option key={index} value={institute}>{institute}</option>
                                    ))}
                                </select>
                                <select name="course" value={filters.course} onChange={handleFilterChange}>
                                    <option value="">Select Course</option>
                                    {filters.courses.map((course, index) => (
                                        <option key={index} value={course}>{course}</option>
                                    ))}
                                </select>
                                <select name="allottedCategory" value={filters.allottedCategory} onChange={handleFilterChange}>
                                    <option value="">Select Category</option>
                                    {Array.isArray(filters.allottedCategory) && filters.allottedCategory.map((allottedCategory, index) => (
                                        <option key={index} value={allottedCategory}>{allottedCategory}</option>
                                    ))}
                                </select>
                                <select name="candidateCategory" value={filters.candidateCategory} onChange={handleFilterChange}>
                                    <option value="">Select Candidate Category</option>
                                    {Array.isArray(filters.candidateCategory) && filters.candidateCategory.map((candidateCategory, index) => (
                                        <option key={index} value={candidateCategory}>{candidateCategory}</option>
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
                                    <th>Allotted Category</th>
                                    <th>Candidate Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.rank}</td>
                                            <td>{item.allottedQuota}</td>
                                            <td>{item.allottedInstitute}</td>
                                            <td>{item.course}</td>
                                            <td>{item.allottedCategory}</td>
                                            <td>{item.candidateCategory}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No data available</td>
                                    </tr>
                                )}
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
