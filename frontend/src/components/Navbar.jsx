// src/components/Navbar.jsx
import React from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../recoil/atoms/authState';
import { useNavigate } from 'react-router-dom';
import { logout } from "../services/authService.js";

const Navbar = () => {
    const [auth, setAuth] = useRecoilState(authState);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            setAuth({ isLoggedIn: false, user: null });
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="bg-gray-900 p-4 shadow-lg fixed w-full z-10 top-0 flex justify-between items-center text-white">
            {/* Logo / Title */}
            <div
                className="text-2xl font-bold cursor-pointer hover:text-gray-300"
                onClick={() => navigate('/')}
            >
                Finance Tracker
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
                {auth.isLoggedIn ? (
                    <>
                        {/* Conditional links for admin or member */}
                        {auth.user?.role === 'admin' ? (
                            <>
                                <button onClick={() => navigate('/admin-dashboard/all-users')} className="hover:text-gray-300">Dashboard</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate('/user-dashboard/user-balance')} className="hover:text-gray-300">Your Balance</button>
                            </>
                        )}
                        {/* Logout Button */}
                        <button onClick={handleLogout} className="hover:text-red-400 font-semibold">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        {/* Guest Links */}
                        <button onClick={() => navigate('/login')} className="hover:text-gray-300">
                            Login
                        </button>
                        <button onClick={() => navigate('/register')} className="hover:text-gray-300">
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
