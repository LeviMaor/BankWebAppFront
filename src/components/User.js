import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Outlet } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import { Box, Typography, Paper } from '@mui/material';

const User = () => {
    const { auth } = useContext(AuthContext);

    return (
        <Box sx={{ p: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: 'white' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                    User Dashboard
                </Typography>
                <Typography variant="h6" sx={{ color: '#1976d2', mb: 3 }}>
                    Welcome, <span style={{ fontWeight: 'bold' }}>{auth.email}</span>!
                </Typography>
                <UserNavbar />
            </Paper>
            <Box sx={{ mt: 4 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default User;
