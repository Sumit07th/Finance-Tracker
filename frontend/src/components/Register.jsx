import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/authService'; // Ensure both paths are correct
import { useRecoilState } from 'recoil';
import { authState } from '../recoil/atoms/authState'; // Update the import path if necessary
import { AiOutlineClose } from 'react-icons/ai'; // Import red cross icon

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [auth, setAuth] = useRecoilState(authState); // Use Recoil for auth state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Register the user as an admin
            const registerResponse = await register({ username, email, password, role: 'admin' });

            if (registerResponse.token) {
                // Automatically log in the newly registered user
                const loginResponse = await login({ email, password });

                if (loginResponse.token) {
                    // Save token to localStorage
                    localStorage.setItem('token', loginResponse.token);
                    // Update the auth state
                    setAuth({
                        isLoggedIn: true,
                        user: { role: 'admin', email: loginResponse.user.email },
                    });
                    navigate('/admin-dashboard'); // Redirect to admin dashboard
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-500">
            <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-md">
                {/* Red Cross Button */}
                <button
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    onClick={() => navigate('/')}
                >
                    <AiOutlineClose size={24} />
                </button>

                {/* Register Form */}
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 transition duration-300"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
