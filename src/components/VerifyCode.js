import React, { useState } from 'react';
import axios from '../api/axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material';

const VERIFY_CODE_URL = '/auth/verify-reset-code';

const VerifyCode = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location.state || {};

    const [code, setCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(VERIFY_CODE_URL, JSON.stringify({ email, code }), {
                headers: { 'Content-Type': 'application/json' },
            });
            setSuccessMsg('Code verified! You can now reset your password.');
            navigate('/reset-password', { state: { email, code } });
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to verify code.');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" mb={3}>
                    Verify Code
                </Typography>
                {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
                {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Verification Code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Verify Code
                    </Button>
                </form>
                <Typography mt={2} align="center">
                    Remembered your password? <Link to="/login">Login</Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default VerifyCode;
