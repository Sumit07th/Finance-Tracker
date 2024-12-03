import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/./Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GroupPage from "./pages/GroupPage.jsx";

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

                    </Route>



                </Routes>
            </main>
        </Router>
    );
}

export default App;
