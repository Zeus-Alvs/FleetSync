import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center bg-grafite text-white">Carregando...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;