import React, { useState, useContext, useRef } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Box, Button, TextField, Typography, Alert, Paper, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CREATE_ADMIN_URL = '/auth/admin-signup';

const CreateAdmin = () => {
    const { auth } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const passwordRef = useRef(null);
    const verifyPasswordRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== verifyPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');

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
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
        passwordRef.current.focus();
    };

    const toggleVerifyPasswordVisibility = () => {
        setShowVerifyPassword((prev) => !prev);
        verifyPasswordRef.current.focus();
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
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        inputRef={passwordRef}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    <TextField
                        label="Verify Password"
                        type={showVerifyPassword ? 'text' : 'password'}
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        inputRef={verifyPasswordRef}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={toggleVerifyPasswordVisibility} edge="end">
                                    {showVerifyPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Admin'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default CreateAdmin;
