import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PrivateRoute({ allowedRoles }) {
    const localCurrentUser = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();

    if (!localCurrentUser) {
        toast.error("Please login first",{
            position: "top-right",
            autoClose: 5000, // Auto close after 5 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        return <Navigate to="/login" state={{ from: location }}/>;
    }

    const token = localCurrentUser.token;
    const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp * 1000;
    console.log(tokenExpiration, "token exp");
    const currentTime = new Date().getTime();

    if (currentTime >= tokenExpiration) {
        toast.error("Session expired, please log in again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        localStorage.removeItem('user');
        return <Navigate to="/login" state={{ from: location }}/>;
    }

    // Check if the user's role is allowed
    const userType = localCurrentUser.userType;
    if (!allowedRoles.includes(userType)) {
        toast.error("Access denied. You do not have the required permissions.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return <Navigate to="/" state={{ from: location }} />;
    }

    return <Outlet />;
}
