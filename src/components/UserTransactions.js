import React, { useEffect, useState, useContext } from 'react';
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
    CircularProgress
} from '@mui/material';

const TRANSACTIONS_URL = '/transactions';

const UserTransactions = () => {
    const { auth } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setErrorMsg('');
            try {
                const response = await axios.get(TRANSACTIONS_URL, {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` },
                });
                const allTransactions = response.data.transactions;

                const twoMonthsAgo = new Date();
                twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

                const recentTransactions = allTransactions.filter(transaction =>
                    new Date(transaction.date) >= twoMonthsAgo
                );

                recentTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

                setTransactions(recentTransactions);
            } catch (err) {
                setErrorMsg('Failed to load transactions');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 900, margin: 'auto' }}>
            <Typography variant="h4" mb={3} align="left" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                Transaction History
            </Typography>

            {errorMsg && <Alert severity="error" sx={{ mb: 2, maxWidth: 600, margin: 'auto' }}>{errorMsg}</Alert>}

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <CircularProgress size={60} thickness={5} color="primary" />
                </Box>
            ) : transactions.length > 0 ? (
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
                            {transactions.map((transaction, index) => (
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
            ) : (
                <Typography align="center" color="textSecondary" mt={4} sx={{ fontSize: '1.2rem' }}>
                    No transactions found in the last 2 months.
                </Typography>
            )}
        </Box>
    );
};

export default UserTransactions;
