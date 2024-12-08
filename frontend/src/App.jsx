import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/./Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GroupPage from "./pages/GroupPage.jsx";
import GroupInfo from "./pages/GroupInfo.jsx";
import JoinGroupInfo from "./pages/JoinGroupInfo.jsx";
import PersonalExpense from "./pages/PersonalExpense.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";

function App() {
    return (
        <Router>
            <Navbar />
            <main className="pt-16">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                        <Route path="create-group" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
                        <Route path="group-info/:groupId" element={<ProtectedRoute><GroupInfo /></ProtectedRoute>} />
                        <Route path="joingroup-info/:groupId" element={<ProtectedRoute><JoinGroupInfo /></ProtectedRoute>} />
                        <Route path="personal-expenses" element={<ProtectedRoute><PersonalExpense /></ProtectedRoute>} />
                        <Route path="change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                        <Route path="user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                    </Route>
                </Routes>
            </main>
        </Router>
    );
}

export default App;
