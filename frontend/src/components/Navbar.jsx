// src/components/Navbar.jsx
import React from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../recoil/atoms/authState'; // Update the import path if necessary
import { useNavigate } from 'react-router-dom';
import {logout} from "../services/authService.js";

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
        <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
            <div className="text-lg font-bold">Finance Tracker</div>
            <div className="flex space-x-4">
                {auth.isLoggedIn ? (
                    <>
                        <button onClick={handleLogout} className="hover:text-gray-300">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
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
