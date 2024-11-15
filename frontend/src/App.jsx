import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AllUsers from "./pages/AllUsers.jsx";
import AddUser from "./pages/AddUser.jsx";
import AddGroupExpense from "./pages/AddGroupExpense.jsx";
import AllHistory from "./pages/AllHistory.jsx";
import MemberHistory from "./pages/MemberHistory.jsx";
import UserBalance from "./pages/UserBalance.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    return (
        <Router>
            <Navbar />
            <main className="pt-16">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin-dashboard/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
                        <Route path="all-history" element={<ProtectedRoute><AllHistory /></ProtectedRoute>} />
                        <Route path="all-users" element={<ProtectedRoute><AllUsers /></ProtectedRoute>} />
                        <Route path="add-user" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
                        <Route path="add-group-expense" element={<ProtectedRoute><AddGroupExpense /></ProtectedRoute>} />
                    </Route>
                    <Route path="/user-dashboard/*" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
                        <Route path="user-balance" element={<UserBalance />} />
                        <Route path="member-history" element={<MemberHistory />} />
                    </Route>


                </Routes>
            </main>
        </Router>
    );
}

export default App;
