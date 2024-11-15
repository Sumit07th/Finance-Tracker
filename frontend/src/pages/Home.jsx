// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaMoneyBillWave, FaHistory, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen text-white">
            {/* Hero Section */}
            <header className="flex flex-col items-center justify-center text-center py-20 px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Welcome to <span className="text-yellow-300">Finance Tracker</span>
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mb-8">
                    Simplify expense management for individuals and groups. Track expenses, settle debts, and stay organized effortlessly.
                </p>
                <div className="space-x-4">
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-yellow-400 text-blue-800 font-bold rounded shadow hover:bg-yellow-300 transition"
                    >
                        Log In
                    </Link>
                    <Link
                        to="/register"
                        className="px-6 py-3 bg-white text-blue-800 font-bold rounded shadow hover:bg-gray-100 transition"
                    >
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Features Section */}
            <section className="bg-white text-blue-800 py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Feature Cards */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                        <FaUsers className="text-4xl text-blue-500 mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
                        <p>Admins can add or remove users and track their financial activity.</p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                        <FaMoneyBillWave className="text-4xl text-blue-500 mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
                        <p>Record individual and group expenses with ease.</p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                        <FaHistory className="text-4xl text-blue-500 mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2">Expense History</h3>
                        <p>View detailed history of personal and group expenses.</p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                        <FaShieldAlt className="text-4xl text-blue-500 mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                        <p>All your financial data is protected with advanced security.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gradient-to-r from-teal-500 to-blue-500 text-white py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Testimonial Cards */}
                    <div className="bg-white text-blue-800 p-6 rounded-lg shadow-lg">
                        <p className="italic">"Finance Tracker made managing my group expenses a breeze. Highly recommend!"</p>
                        <p className="text-right font-bold mt-4">- Alex Johnson</p>
                    </div>
                    <div className="bg-white text-blue-800 p-6 rounded-lg shadow-lg">
                        <p className="italic">"I love how easy it is to track my debts and settle them. A lifesaver!"</p>
                        <p className="text-right font-bold mt-4">- Priya Sharma</p>
                    </div>
                    <div className="bg-white text-blue-800 p-6 rounded-lg shadow-lg">
                        <p className="italic">"The admin features are fantastic. Managing expenses has never been this simple."</p>
                        <p className="text-right font-bold mt-4">- Mark Lee</p>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-yellow-400 text-blue-800 py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Ready to Simplify Your Finances?
                </h2>
                <div className="flex justify-center space-x-4">
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-blue-500 text-white font-bold rounded shadow hover:bg-blue-600 transition"
                    >
                        Log In
                    </Link>
                    <Link
                        to="/register"
                        className="px-6 py-3 bg-white text-blue-800 font-bold rounded shadow hover:bg-gray-100 transition"
                    >
                        Sign Up
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-400 py-6 text-center">
                <p>© 2024 Finance Tracker. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
