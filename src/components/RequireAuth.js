import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Box } from '@mui/material';

const RequireAuth = ({ allowedRoles }) => {
    const { auth, loading } = useContext(AuthContext);

    return auth.roles.some(role => allowedRoles.includes(role))
        ? <Outlet />
        : <Navigate to="/unauthorized" />;
};

export default RequireAuth;