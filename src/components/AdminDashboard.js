import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import {
    Box,
    TextField,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Typography
} from '@mui/material';
import { Link } from 'react-router-dom';

const USERS_URL = '/users/all';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(USERS_URL, {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` },
                });
                setUsers(response.data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
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
                                        <Link 
                                            to={`/admin/users/${user._id}/transactions`} 
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <Typography sx={{ color: 'primary.main', textDecoration: 'none' }}>
                                                View Transactions
                                            </Typography>
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
