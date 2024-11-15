// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../recoil/atoms/authState';

const ProtectedRoute = ({ children }) => {
    const auth = useRecoilValue(authState);

    if (!auth?.isLoggedIn) {
        // If the user is not logged in, redirect to the login page
        return <Navigate to="/login" />;
    }

    // Otherwise, render the children components
    return children;
};

export default ProtectedRoute;
