
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../auth-service';

const PublicRoute = () => {
  return !AuthService.isAuthenticated() ? <Outlet /> : <Navigate to="/profil" />;
};

export default PublicRoute;
