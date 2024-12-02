import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService'; // Ensure this path is correct
import { useRecoilState } from 'recoil';
import { authState } from '../recoil/atoms/authState'; // Update the import path if necessary
import { AiOutlineClose } from 'react-icons/ai'; // Import red cross icon

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
                if (response.user) {
                    localStorage.setItem('token', response.token);
                    setAuth({
                        isLoggedIn: true,
                        user: {
                            _id: response.user._id,
                            role: response.user.role,
                            email: response.user.email,
                            username: response.user.username
                        }
                    });
                    navigate('/dashboard');
                } else {
                    setError('User information not found.');
                }
            } else {
                setError('Invalid login credentials.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-teal-500">
            <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-md">
                {/* Red Cross Button */}
                <button
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    onClick={() => navigate('/')}
                >
                    <AiOutlineClose size={24} />
                </button>

                {/* Login Form */}
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
