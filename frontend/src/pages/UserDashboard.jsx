import React from 'react';
import Sidebar from '../components/Sidebar';
import MemberHistory from './MemberHistory';
import UserBalance from './UserBalance';
import { Route, Routes } from 'react-router-dom';

const UserDashboard = () => (
    <div className="flex">
        <Sidebar role="user" />
        <div className="p-4 w-full">
            <Routes>
                <Route path="user-balance" element={<UserBalance />} />
                <Route path="member-history" element={<MemberHistory />} />
            </Routes>
        </div>
    </div>
);

export default UserDashboard;
