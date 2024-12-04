// src/pages/Dashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import CreateGroup from "./GroupPage.jsx";
import GroupInfo from "./GroupInfo.jsx";
import JoinGroupInfo from "./JoinGroupInfo.jsx";

const Dashboard = () => (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        <Sidebar role="admin" />
        <div className="ml-64 p-8 flex-grow overflow-y-auto">
            <div className="bg-white shadow-lg rounded-lg p-8 transition-transform duration-300 hover:shadow-xl transform hover:scale-105">
                <Routes>
                    <Route path="create-group" element={<CreateGroup />} />
                    <Route path="group-info/:groupId" element={<GroupInfo />} />
                    <Route path="joingroup-info/:groupId" element={<JoinGroupInfo />} />
                </Routes>
            </div>
        </div>
    </div>
);

export default Dashboard;
