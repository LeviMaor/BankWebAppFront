import React, { useContext } from 'react';
import { Typography, Button, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Missing = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const handleGoHome = () => {
        if (!auth || !auth.accessToken) {
            navigate('/login');
        } else {
            const isAdmin = auth.roles?.includes('admin');
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/info');
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 3,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Oops!
                </Typography>
                <Typography variant="h5" sx={{ color: '#333' }}>
                    Page Not Found
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: '#555' }}>
                    Sorry, the page you’re looking for doesn’t exist or has been moved.
                </Typography>
                <Button
                    onClick={handleGoHome}
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none', px: 4, py: 1.5 }}
                >
                    Go to Homepage
                </Button>
            </Paper>
        </Container>
    );
};

export default Missing;
