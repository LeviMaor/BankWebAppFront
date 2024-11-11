import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    CircularProgress,
    TablePagination,
    Button
} from '@mui/material';

const TransactionsById = () => {
    const { auth } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [email, setEmail] = useState('');
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setErrorMsg('');
            try {
                const response = await axios.get(`/transactions/user/${id}`, {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` },
                });

                const sortedTransactions = response.data.transactions.sort((a, b) =>
                    new Date(b.date) - new Date(a.date)
                );

                setTransactions(sortedTransactions);
                setEmail(response.data.email);
                setBalance(response.data.balance);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    const userResponse = await axios.get(`/users/${id}`, {
                        headers: { Authorization: `Bearer ${auth?.accessToken}` },
                    });
                    setEmail(userResponse.data.email);
                    setBalance(userResponse.data.balance);
                } else {
                    setErrorMsg('Failed to load transactions.');
                }
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [id, auth]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteUser = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                await axios.delete(`/users/${id}`, {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` },
                });
                alert("User deleted successfully.");
                navigate('/admin/dashboard');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert("Failed to delete user.");
            }
        }
    };

    const currentTransactions = transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 4, maxWidth: 900, margin: 'auto' }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Email: {email}
            </Typography>
            <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Balance: ${balance.toFixed(2)}
            </Typography>

            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

            <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteUser}
                >
                    Delete User
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <CircularProgress size={60} thickness={5} color="primary" />
                </Box>
            ) : transactions.length > 0 ? (
                <>
                    <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Amount ($)</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Sender</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Recipient</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentTransactions.map((transaction, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                            '&:hover': { backgroundColor: '#f1f1f1' }
                                        }}
                                    >
                                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                                        <TableCell>{transaction.senderEmail}</TableCell>
                                        <TableCell>{transaction.recipientEmail}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        component="div"
                        count={transactions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            ) : (
                <Typography align="center" color="textSecondary" mt={4} sx={{ fontSize: '1.2rem' }}>
                    No transactions found.
                </Typography>
            )}
        </Box>
    );
};

export default TransactionsById;
