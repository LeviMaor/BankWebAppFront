// src/components/CreateAdmin.js
import React, { useState, useContext } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Paper
} from '@mui/material';

const CREATE_ADMIN_URL = '/auth/admin-signup';

const CreateAdmin = () => {
    const { auth } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== verifyPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        try {
            await axios.post(
                CREATE_ADMIN_URL,
                JSON.stringify({ email, password }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth?.accessToken}`
                    }
                }
            );
            alert('Admin created successfully');
            navigate('/admin/dashboard');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to create admin');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" mb={3}>
                    Create New Admin
                </Typography>
                {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Admin Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Verify Password"
                        type="password"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Create Admin
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default CreateAdmin;
