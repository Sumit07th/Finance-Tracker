// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaUserPlus, FaMoneyBillWave, FaHistory, FaBalanceScale, FaClock } from 'react-icons/fa';

const Sidebar = ({ role }) => {
    const location = useLocation();

    // Function to add active style to the currently selected link
    const isActive = (path) => location.pathname === path ? 'bg-gray-700 text-white' : 'text-gray-400';

    return (
        <aside className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg flex flex-col justify-between p-4">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-6">Finance Tracker</h2>

                    <>
                        <Link to="/dashboard/create-group" className={`flex items-center space-x-2 p-2 rounded ${isActive('/admin-dashboard/all-users')} hover:bg-gray-700`}>
                            <FaUsers />
                            <span>Create Group</span>
                        </Link>
                        <Link to="/dashboard/add-group-expense" className={`flex items-center space-x-2 p-2 rounded ${isActive('/admin-dashboard/add-group-expense')} hover:bg-gray-700`}>
                            <FaMoneyBillWave />
                            <span>All Groups</span>
                        </Link>
                        <Link to="/dashboard/all-history" className={`flex items-center space-x-2 p-2 rounded ${isActive('/admin-dashboard/all-history')} hover:bg-gray-700`}>
                            <FaHistory />
                            <span>All History</span>
                        </Link>
                        <Link to="/dashboard/user-balance" className={`flex items-center space-x-2 p-2 rounded ${isActive('/user-dashboard/user-balance')} hover:bg-gray-700`}>
                            <FaBalanceScale />
                            <span>Your Balance</span>
                        </Link>
                        <Link to="/dashboard/member-history" className={`flex items-center space-x-2 p-2 rounded ${isActive('/user-dashboard/member-history')} hover:bg-gray-700`}>
                            <FaClock />
                            <span>Your History</span>
                        </Link>
                    </>

            </div>
            <footer className="text-gray-400 text-sm mt-6">
                © 2024 Finance Tracker
            </footer>
        </aside>
    );
};

export default Sidebar;
