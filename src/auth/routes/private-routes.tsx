import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../auth-service';

const PrivateRoute = () => {
  return AuthService.isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
