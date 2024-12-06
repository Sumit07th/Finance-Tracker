import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../recoil/atoms/authState';
import { useNavigate } from 'react-router-dom';
import { logout } from "../services/authService";
import { getNotification, respondNotification } from "../services/notifyService";

const Navbar = () => {
    const [auth, setAuth] = useRecoilState(authState);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setAuth({ isLoggedIn: false, user: null });
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await getNotification();
            if (response && Array.isArray(response.data.notifications)) {
                setNotifications(response.data.notifications);
            } else {
                setNotifications([]); // Default to an empty array if response is invalid
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setNotifications([]); // Optional: reset notifications on error
        }
    };

    const handleResponse = async (notificationId, response) => {
        const respondData = {
            notificationId,
            response,
        }
        try {
            await respondNotification(respondData);
            setNotifications(notifications.filter(notif => notif._id !== notificationId));
        } catch (error) {
            console.error("Failed to respond to notification:", error);
        }
    };

    useEffect(() => {
        if (auth.isLoggedIn) {
            fetchNotifications();
        }
    }, [auth.isLoggedIn]);

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
                        <button onClick={() => navigate('/dashboard/all-users')} className="hover:text-gray-300">
                            Dashboard
                        </button>

                        {/* Notification Icon */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="relative hover:text-gray-300"
                            >
                                <span className="material-icons">notifications</span>
                                {notifications && notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 bg-white text-gray-900 w-80 rounded shadow-lg">
                                    <div className="p-4">
                                        {notifications.length === 0 ? (
                                            <div>No notifications</div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif._id}
                                                    className="border-b last:border-b-0 pb-2 mb-2"
                                                >
                                                    <div className="font-bold">{notif.type}</div>
                                                    <div>{notif.message}</div>
                                                    <div className="flex space-x-2 mt-2">
                                                        <button
                                                            onClick={() => handleResponse(notif._id, 'Accepted')}
                                                            className="text-green-600 hover:underline"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleResponse(notif._id, 'Rejected')}
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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
