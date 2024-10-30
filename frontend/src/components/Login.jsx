// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService'; // Make sure this path is correct
import { useRecoilState } from 'recoil';
import { authState } from '../recoil/atoms/authState'; // Update the import path if necessary

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [auth, setAuth] = useRecoilState(authState); // Use Recoil for auth state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login({ email, password });
            console.log('API Response:', response); // Log the response for debugging

            if (response.token) {
                // Check if user object is present
                if (response.user) {
                    // Save token to localStorage or state management (like Recoil)
                    localStorage.setItem('token', response.token);
                    // Update the auth state
                    setAuth({ isLoggedIn: true, user: { role: response.user.role, email: response.user.email } });
                    navigate(response.user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'); // Redirect to dashboard
                } else {
                    setError('User information not found.'); // Handle missing user data
                }
            } else {
                setError('Invalid login credentials.'); // Handle login failure
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed'); // Show error message if available
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 rounded w-full p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded w-full p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded w-full py-2 hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account? <a href="/register" className="text-blue-500">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
