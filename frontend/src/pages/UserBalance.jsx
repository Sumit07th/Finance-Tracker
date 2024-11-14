// src/components/UserBalance.jsx
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../recoil/atoms/authState';
import { fetchMemberBalance } from '../services/expenseService';

const UserBalance = () => {
    const [balance, setBalance] = useState(0);
    const auth = useRecoilValue(authState);

    useEffect(() => {
        const getBalance = async () => {
            if (auth && auth.user) {
                try {
                    const data = await fetchMemberBalance(auth.user._id);
                    console.log('Fetched balance data:', data);
                    setBalance(data.balance || 0);
                } catch (error) {
                    console.error('Error fetching balance:', error);
                }
            }
        };

        getBalance();
    }, [auth]);

    const handlePay = () => {
        console.log('Payment processing for amount:', balance);
    };

    return (
        <div className="p-6 ml-64"> {/* Add left margin to align with sidebar */}
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">User Balance</h2>
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg max-w-md">
                {auth && auth.user ? (
                    <>
                        <p className="text-lg font-medium text-gray-700 mb-4">
                            <strong>Member Name:</strong> {auth.user.username}
                        </p>
                        <p className="text-lg font-medium text-gray-700 mb-4">
                            <strong>Amount to Pay:</strong> ₹{balance.toFixed(2)}
                        </p>
                        <button
                            onClick={handlePay}
                            className="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
                        >
                            Pay Now
                        </button>
                    </>
                ) : (
                    <p className="text-gray-500">Loading user information...</p>
                )}
            </div>
        </div>
    );
};

export default UserBalance;
