import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { CircularProgress, Box } from '@mui/material';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedAuth = sessionStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : { roles: [] };
  });
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAuthenticated') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      const jwtToken = token ? token.split('=')[1] : null;

      if (jwtToken) {
        try {
          const response = await axios.get('/users/profile', {
            headers: { Authorization: `Bearer ${jwtToken}` },
          });
          const { email, roles } = response.data;
          if (roles && roles.length) {
            const newAuth = { email, roles, accessToken: jwtToken };
            setAuth(newAuth);
            sessionStorage.setItem('auth', JSON.stringify(newAuth));
            sessionStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            // Redirect based on roles
            if (window.location.pathname === '/') {
              navigate(roles.includes('admin') ? '/admin/dashboard' : '/user/info');
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setAuth({ roles: [] });
          navigate('/login');
        }
      } else {
        setAuth({ roles: [] });
        const currentPath = window.location.pathname;
        if (currentPath !== '/signup' && currentPath !== '/login') {
          navigate('/login');
        }
      }
    };
    checkAuth();
  }, [isAuthenticated]);


  return (
    <AuthContext.Provider value={{ auth, setAuth, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;