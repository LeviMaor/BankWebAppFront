import React, { useState } from 'react';
import axios from '../api/axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material';

const RESET_PASSWORD_URL = '/auth/reset-password';

const ResetPassword = () => {
    const location = useLocation();
    const { email, code } = location.state || {};

    const [newPassword, setNewPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(RESET_PASSWORD_URL, JSON.stringify({ email, code, newPassword }), {
                headers: { 'Content-Type': 'application/json' },
            });
            setSuccessMsg('Your password has been reset successfully.');
            navigate('/login');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" mb={3}>
                    Reset Password
                </Typography>
                {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
                {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            mt: 2,
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#115293',
                            },
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
                <Typography mt={2} align="center">
                    Remembered your password? <Link to="/login">Login</Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default ResetPassword;
