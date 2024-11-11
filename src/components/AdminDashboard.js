import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import {
    Box,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
    Typography,
    Paper,
    Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

const USERS_URL = '/users/all';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    // Calculate the current users to display based on pagination
    const currentUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };

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
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map(user => (
                                        <TableRow key={user._id}>
                                            <TableCell>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                    {user.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Link
                                                    to={`/admin/users/${user._id}/transactions`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        sx={{ borderRadius: '20px' }}
                                                    >
                                                        View Transactions
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">No users found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
        </Box>
    );
};

export default AdminDashboard;
