import React, { useState } from 'react';
import axios from '../api/axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material';

const VERIFY_CODE_URL = '/auth/verify-reset-code';
const RESEND_CODE_URL = '/auth/forgot-password';

const VerifyCode = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location.state || {};

    const [code, setCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(VERIFY_CODE_URL, JSON.stringify({ email, code }), {
                headers: { 'Content-Type': 'application/json' },
            });
            setSuccessMsg('Code verified! You can now reset your password.');
            navigate('/reset-password', { state: { email, code } });
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to verify code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            await axios.post(RESEND_CODE_URL, JSON.stringify({ email }), {
                headers: { 'Content-Type': 'application/json' },
            });
            setSuccessMsg('A new code has been sent to your email.');
            setErrorMsg('');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to resend code.');
        } finally {
            setIsResending(false);
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
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                    </Button>
                </form>
                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{
                        mt: 2,
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                            borderColor: '#115293',
                            color: '#fff',
                            backgroundColor: '#1976d2',
                        },
                    }}
                    onClick={handleResendCode}
                    disabled={isResending}
                >
                    {isResending ? 'Sending...' : 'Send New Code'}
                </Button>
                <Typography mt={2} align="center">
                    Remembered your password? <Link to="/login">Login</Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default VerifyCode;
