import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
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
    TablePagination
} from '@mui/material';

const TransactionsById = () => {
    const { id } = useParams(); // Get the ID from URL
    const [transactions, setTransactions] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(20); // Show 20 rows per page
    const { auth } = useContext(AuthContext);
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
                setErrorMsg('Failed to load transactions');
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
        setPage(0); // Reset to first page
    };

    // Calculate the current transactions to display
    const currentTransactions = transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 4, maxWidth: 900, margin: 'auto' }}>
            {/* Display Email and Balance */}
            <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Email: {email}
            </Typography>
            <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Balance: ${balance.toFixed(2)}
            </Typography>

            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

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

                    {/* Pagination Control */}
                    <TablePagination
                        rowsPerPageOptions={[20, 50, 100]} // Options to select rows per page
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
