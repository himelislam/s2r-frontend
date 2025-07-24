import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const sessionCurrentUser = JSON.parse(sessionStorage.getItem('user'));
    const localCurrentUser = JSON.parse(localStorage.getItem('user'));
    const currentUser = localCurrentUser || sessionCurrentUser;

    if (currentUser) {
      // Redirect based on user type
      if (currentUser.userType === 'owner') {
        navigate('/b/dashboard');
      } else if (currentUser.userType === 'referrer') {
        navigate('/r/dashboard');
      } else {
        navigate('/select-role');
      }
    } else {
      // Redirect to login if not logged in
      navigate('/auth/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Attach N' Hatch
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your referral management platform
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => navigate('/auth/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/auth/signup')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;