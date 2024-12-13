import React, { useEffect, useState } from 'react';
import { addPersonalIncome, updatePersonalIncome, getPersonalIncome } from '../services/authService';

const UserDashboard = () => {
    const [income, setIncome] = useState(0); // Store user's income
    const [loading, setLoading] = useState(true); // Show loading state
    const [modalOpen, setModalOpen] = useState(false); // Toggle modal visibility
    const [amount, setAmount] = useState(''); // Store input amount
    const [actionType, setActionType] = useState(''); // Store action type: add or update

    // Fetch income from the backend
    const fetchIncome = async () => {
        try {
            setLoading(true);
            const response = await getPersonalIncome();
            setIncome(response?.data?.income || 0);
        } catch (error) {
            console.error('Error fetching income:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add or update income
    const handleSubmit = async () => {
        if (!amount || isNaN(amount)) {
            alert('Please enter a valid number.');
            return;
        }

        try {
            if (actionType === 'add') {
                await addPersonalIncome({ income: Number(amount) });
                alert('Income added successfully!');
            } else if (actionType === 'update') {
                await updatePersonalIncome({ income: Number(amount) });
                alert('Income updated successfully!');
            }
            fetchIncome(); // Refresh income after updating
            setModalOpen(false);
            setAmount('');
        } catch (error) {
            console.error(`Error ${actionType}ing income:`, error);
            alert('An error occurred. Please try again.');
        }
    };

    // Fetch income on page load
    useEffect(() => {
        fetchIncome();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
            <h1 className="text-3xl font-bold mb-6">Manage Your Income</h1>

            {income === 0 ? (
                <button
                    onClick={() => {
                        setActionType('add');
                        setModalOpen(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Add Income
                </button>
            ) : (
                <button
                    onClick={() => {
                        setActionType('update');
                        setModalOpen(true);
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Update Income
                </button>
            )}

            <div className="mt-6 text-lg font-semibold">
                {income > 0 ? `Total Income: ₹${income}` : 'No income added yet.'}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {actionType === 'add' ? 'Add Income' : 'Update Income'}
                        </h2>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-2 text-black mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
