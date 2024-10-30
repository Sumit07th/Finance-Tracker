// src/components/Navbar.jsx
import React from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../recoil/atoms/authState'; // Update the import path if necessary
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [auth, setAuth] = useRecoilState(authState);
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({ isLoggedIn: false, user: null });
        localStorage.removeItem('authState'); // Clear auth from localStorage
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
            <div className="text-lg font-bold">Finance Tracker</div>
            <div className="flex space-x-4">
                {auth.isLoggedIn ? (
                    <>
                        <button onClick={() => navigate('/dashboard')} className="hover:text-gray-300">
                            Dashboard
                        </button>
                        {auth.user.role === 'admin' && (
                            <>
                                <button onClick={() => navigate('/manage-users')} className="hover:text-gray-300">
                                    Manage Users
                                </button>
                                <button onClick={() => navigate('/add-expense')} className="hover:text-gray-300">
                                    Add Expense
                                </button>
                            </>
                        )}
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
