import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AllotmentsTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roundFilter, setRoundFilter] = useState('All');

    useEffect(() => {
        fetchData();
    }, [roundFilter]);

    async function fetchData() {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5001/api/allotments');
            if (roundFilter === 'All') {
                setData(response.data);
            } else {
                setData(response.data.filter(item => item.round === parseInt(roundFilter)));
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setLoading(false);
        }
    }

    async function generateCombinedResult() {
        try {
            await axios.post('http://localhost:5001/api/generate');
            fetchData(); // Refresh the data
            alert('Combined result generated successfully');
        } catch (error) {
            console.error('Error generating combined result', error);
            alert('Failed to generate combined result');
        }
    }

    async function deleteRound(round) {
        try {
            await axios.delete(`http://localhost:5001/api/delete/${round}`);
            fetchData(); // Refresh the data
            alert(`Round ${round} data deleted successfully`);
        } catch (error) {
            console.error('Error deleting round data', error);
            alert('Failed to delete round data');
        }
    }

    return (
        <div>
            <h1>Allotments Table</h1>
            <button onClick={generateCombinedResult}>Generate Combined Result</button>
            <button onClick={() => deleteRound(1)}>Delete Round 1</button>
            <button onClick={() => deleteRound(2)}>Delete Round 2</button>
            <button onClick={() => deleteRound(3)}>Delete Round 3</button>
            <div>
                <label>Filter by Round:</label>
                <select value={roundFilter} onChange={(e) => setRoundFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="1">Round 1</option>
                    <option value="2">Round 2</option>
                    <option value="3">Round 3</option>
                </select>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Allotted Quota</th>
                            <th>Allotted Institute</th>
                            <th>Course</th>
                            <th>Allotted Category</th>
                            <th>Candidate Category</th>
                            <th>Round</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.rank}</td>
                                <td>{item.allottedQuota}</td>
                                <td>{item.allottedInstitute}</td>
                                <td>{item.course}</td>
                                <td>{item.allottedCategory}</td>
                                <td>{item.candidateCategory}</td>
                                <td>{item.round}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AllotmentsTable;
