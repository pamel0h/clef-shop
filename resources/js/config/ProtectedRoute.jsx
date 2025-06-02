// src/components/ProtectedRoute.jsx
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;