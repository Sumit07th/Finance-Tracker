// src/pages/Dashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import AllUsers from './AllUsers';
import AddUser from './AddUser';
import AddGroupExpense from './AddGroupExpense';
import AllHistory from './AllHistory';
import { Route, Routes } from 'react-router-dom';
import UserBalance from "./UserBalance.jsx";
import MemberHistory from "./MemberHistory.jsx";

const Dashboard = () => (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        {/* Sidebar */}
        <Sidebar role="admin" />

        {/* Main Content */}
        <div className="ml-64 p-8 flex-grow overflow-y-auto">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Admin Dashboard</h1>
                <p className="text-lg text-gray-700 mt-2">Manage users, expenses, and view history</p>
            </header>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h2 className="text-xl font-bold text-gray-800">Total Users</h2>
                    <p className="text-2xl font-extrabold text-indigo-600">123</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h2 className="text-xl font-bold text-gray-800">Group Expenses</h2>
                    <p className="text-2xl font-extrabold text-indigo-600">₹4,560</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h2 className="text-xl font-bold text-gray-800">Total Debt Settled</h2>
                    <p className="text-2xl font-extrabold text-indigo-600">₹3,400</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h2 className="text-xl font-bold text-gray-800">Pending Requests</h2>
                    <p className="text-2xl font-extrabold text-indigo-600">5</p>
                </div>
            </div>

            {/* Routes for Dynamic Content */}
            <div className="bg-white shadow-lg rounded-lg p-8 transition-transform duration-300 hover:shadow-xl transform hover:scale-105">
                <Routes>
                    <Route path="all-users" element={<AllUsers />} />
                    <Route path="add-user" element={<AddUser />} />
                    <Route path="add-group-expense" element={<AddGroupExpense />} />
                    <Route path="all-history" element={<AllHistory />} />
                    <Route path="user-balance" element={<UserBalance />} />
                    <Route path="member-history" element={<MemberHistory />} />
                </Routes>
            </div>
        </div>
    </div>
);

export default Dashboard;
