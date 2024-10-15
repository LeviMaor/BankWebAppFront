import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Outlet } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import { Box, Typography } from '@mui/material';

const User = () => {
    const { auth } = useContext(AuthContext);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">User Dashboard</Typography>
            <Typography variant="h6">Welcome, {auth.email}!</Typography>
            <UserNavbar />
            <Outlet />
        </Box>
    );
};

export default User;