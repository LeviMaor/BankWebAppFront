import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import {
    Box,
    TextField,
    List,
    ListItem,
    ListItemText,
    Link,
    CircularProgress
} from '@mui/material';

const USERS_URL = '/users/all'; // Route to get all users

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Track loading state
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(USERS_URL, {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` },
                });
                setUsers(response.data.users); // Set users from response
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        fetchUsers();
    }, [auth]);

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.roles &&
        !user.roles.includes('admin') &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 3 }}>
            <TextField
                label="Search by Email"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
            />

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <List>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <ListItem key={user._id}>
                                <ListItemText
                                    primary={user.email}
                                    secondary={
                                        <Link href={`/admin/users/${user._id}/transactions`} underline="hover">
                                            View Transactions
                                        </Link>
                                    }
                                />
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No users found." />
                        </ListItem>
                    )}
                </List>
            )}
        </Box>
    );
};

export default AdminDashboard;
