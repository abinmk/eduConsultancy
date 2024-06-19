import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await axios.get('/api/users');
        setUsers(response.data);
    };

    return (
        <div>
            {users.map(user => (
                <div key={user._id}>{user.name}</div>
            ))}
        </div>
    );
}

export default AdminPanel;
