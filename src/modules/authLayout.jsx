import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AuthLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const sessionCurrentUser = JSON.parse(sessionStorage.getItem('user'));
    const localCurrentUser = JSON.parse(localStorage.getItem('user'));
    const currentUser = localCurrentUser || sessionCurrentUser;
    const isLoggedIn = !!currentUser;

    console.log("AuthLayout is rendered");
    console.log("Current user status:", { isLoggedIn, currentUser });

    useEffect(() => {
        if (isLoggedIn) {
            const userType = currentUser.userType;
            if (userType === 'owner') {
                navigate('/b/dashboard');
            } else if (userType === 'referrer') {
                navigate('/r/dashboard');
            } else if(userType == 'user'){
                navigate('/select-role')
                toast.error('Please select a role to login')
            }
        } else {
            // Only redirect to login if not already on an auth page
            if (!location.pathname.startsWith('/auth/')) {
                console.log('Redirecting to login...');
                navigate('/auth/login');
            }
        }
    }, [isLoggedIn, currentUser, navigate, location.pathname]);

    // Render nothing while redirecting
    if (isLoggedIn) {
        return <div>Loading...</div>; // Placeholder while redirecting
    }

    return <Outlet />;
}
