import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useTable, useSortBy, useFilters } from 'react-table';
import '../styles/Allotments.css';
import Layout from '../components/Layout';
import ReactPaginate from 'react-paginate';

const Allotments = () => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        quota: '',
        institute: '',
        course: '',
        allottedCategory: '',
        candidateCategory: '',
        quotas: [],
        institutes: [],
        courses: [],
        allottedCategories: [],
        candidateCategories: []
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState('');
    const itemsPerPage = 10;

    const fetchData = useCallback(async (page = 1) => {
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
    }, [filters, itemsPerPage]);

    const fetchFilterOptions = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/filter-options');
            setFilters(prevFilters => ({
                ...prevFilters,
                quotas: Array.isArray(response.data.quotas) ? response.data.quotas.map(q => ({ value: q, label: q })) : [],
                institutes: Array.isArray(response.data.institutes) ? response.data.institutes.map(i => ({ value: i, label: i })) : [],
                courses: Array.isArray(response.data.courses) ? response.data.courses.map(c => ({ value: c, label: c })) : [],
                allottedCategories: Array.isArray(response.data.allottedCategories) ? response.data.allottedCategories.map(ac => ({ value: ac, label: ac })) : [],
                candidateCategories: Array.isArray(response.data.candidateCategories) ? response.data.candidateCategories.map(cc => ({ value: cc, label: cc })) : []
            }));
        } catch (error) {
            console.error('Error fetching filter options:', error);
            // Set defaults if fetch fails
            setFilters(prevFilters => ({
                ...prevFilters,
                quotas: [],
                institutes: [],
                courses: [],
                allottedCategories: [],
                candidateCategories: []
            }));
        }
    }, []);

    useEffect(() => {
        const fetchSelectedDataset = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/selected-dataset');
                setSelectedDataset(response.data.selectedDataset || '');
            } catch (error) {
                console.error('Error fetching selected dataset:', error);
            }
        };

        fetchSelectedDataset();
    }, []);

    useEffect(() => {
        if (selectedDataset) {
            fetchFilterOptions();
            fetchData(currentPage + 1);
        }
    }, [selectedDataset, fetchFilterOptions, fetchData, currentPage]);

    const handleFilterChange = (selectedOption, { name }) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: selectedOption ? selectedOption.value : ''
        }));
        fetchData(1);  // Refetch data based on new filters at page 1
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const columns = useMemo(() => [
        { Header: 'Rank', accessor: 'rank' },
        { Header: 'Allotted Quota', accessor: 'allottedQuota' },
        { Header: 'Allotted Institute', accessor: 'allottedInstitute' },
        { Header: 'Course', accessor: 'course' },
        { Header: 'Allotted Category', accessor: 'allottedCategory' },
        { Header: 'Candidate Category', accessor: 'candidateCategory' }
    ], []);

    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: {
                hiddenColumns
            }
        },
        useFilters,
        useSortBy
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        allColumns,
        setHiddenColumns: setTableHiddenColumns
    } = tableInstance;

    useEffect(() => {
        setTableHiddenColumns(hiddenColumns);
    }, [hiddenColumns, setTableHiddenColumns]);

    const handleColumnToggle = (selectedOptions) => {
        const selectedColumnIds = selectedOptions.map(option => option.value);
        const allColumnIds = allColumns.map(column => column.id);
        setHiddenColumns(allColumnIds.filter(id => !selectedColumnIds.includes(id)));
    };

    const columnOptions = useMemo(() => allColumns.map(column => ({ value: column.id, label: column.Header })), [allColumns]);

    const customStyles = {
        control: (provided) => ({
            ...provided,
            minWidth: '200px',
            flex: 1,
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            maxWidth: '100vw', // Constrain dropdown to viewport width
            maxHeight: '300px', // Maximum height for the dropdown
            overflowY: 'auto', // Enable vertical scrolling
            overflowX: 'hidden', // Disable horizontal scrolling
        }),
        option: (provided) => ({
            ...provided,
            whiteSpace: 'nowrap',
        }),
    };

    return (
        <Layout>
            <section className="allotments-section">
                <h1>Allotments</h1>
                <div className="filter-section">
                    <div className="filter-row">
                        <div className="full-width-select">
                            <Select
                                name="institute"
                                value={filters.institutes.find(option => option.value === filters.institute)}
                                onChange={handleFilterChange}
                                options={filters.institutes}
                                placeholder="Select Institute"
                                isClearable
                                styles={customStyles}
                            />
                        </div>
                        <Select
                            name="quota"
                            value={filters.quotas.find(option => option.value === filters.quota)}
                            onChange={handleFilterChange}
                            options={filters.quotas}
                            placeholder="Select Quota"
                            isClearable
                            styles={customStyles}
                        />
                        <Select
                            name="course"
                            value={filters.courses.find(option => option.value === filters.course)}
                            onChange={handleFilterChange}
                            options={filters.courses}
                            placeholder="Select Course"
                            isClearable
                            styles={customStyles}
                        />
                        <Select
                            name="allottedCategory"
                            value={filters.allottedCategories.find(option => option.value === filters.allottedCategory)}
                            onChange={handleFilterChange}
                            options={filters.allottedCategories}
                            placeholder="Select Allotted Category"
                            isClearable
                            styles={customStyles}
                        />
                        <Select
                            name="candidateCategory"
                            value={filters.candidateCategories.find(option => option.value === filters.candidateCategory)}
                            onChange={handleFilterChange}
                            options={filters.candidateCategories}
                            placeholder="Select Candidate Category"
                            isClearable
                            styles={customStyles}
                        />
                    </div>
                </div>

                <div className="column-toggle">
                    <Select
                        isMulti
                        options={columnOptions}
                        onChange={handleColumnToggle}
                        value={columnOptions.filter(option => !hiddenColumns.includes(option.value))}
                        placeholder="Select columns to display"
                        styles={customStyles}
                    />
                </div>

                <table {...getTableProps()} className="table">
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="loader">Loading...</td>
                            </tr>
                        ) : rows.length > 0 ? (
                            rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={columns.length}>No data available</td>
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
                </section>
            </Layout>
        );
    };
    
    export default Allotments;
    
