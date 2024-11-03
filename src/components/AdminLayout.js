import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Box, Typography } from '@mui/material';
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const { auth } = useContext(AuthContext);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">User Dashboard</Typography>
            <Typography variant="h6">Welcome, {auth.email}!</Typography>
            <AdminNavbar />
            <Outlet />
        </Box>
    );
};

export default AdminLayout;
