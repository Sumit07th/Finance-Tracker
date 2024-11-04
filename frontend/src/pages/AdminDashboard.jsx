import React from 'react';
import Sidebar from '../components/Sidebar';
import AllUsers from './AllUsers';
import AddUser from './AddUser';
import AddGroupExpense from './AddGroupExpense';
import AllHistory from './AllHistory';
import { Route, Routes } from 'react-router-dom';

const AdminDashboard = () => (
    <div className="flex">
        <Sidebar role="admin" />
        <div className="p-4 w-full">
            <Routes>
                <Route path="all-users" element={<AllUsers />} />
                <Route path="add-user" element={<AddUser />} />
                <Route path="add-group-expense" element={<AddGroupExpense />} />
                <Route path="all-history" element={<AllHistory />} />
            </Routes>
        </div>
    </div>
);

export default AdminDashboard;
