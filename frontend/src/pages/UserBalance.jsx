import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../recoil/atoms/authState'; // Adjust import path if necessary
import { fetchMemberBalance } from '../services/expenseService'; // Adjust import path if necessary

const UserBalance = () => {
    const [balance, setBalance] = useState(0); // State to store balance
    const auth = useRecoilValue(authState); // Get auth state

    useEffect(() => {
        const getBalance = async () => {
            try {
                const data = await fetchMemberBalance(auth.user._id); // Fetch balance
                console.log('Fetched balance data:', data); // Log fetched data
                setBalance(data.balance || 0); // Assuming the API returns an object with an 'amount' field
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        getBalance();
    }, [auth.user._id]); // Depend on user ID

    const handlePay = () => {
        // Logic for handling payment (e.g., API call to process payment)
        console.log('Payment processing for amount:', balance);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">User Balance</h2>
            <div className="border p-4 rounded shadow">
                <p><strong>Member Name:</strong> {auth.user.username}</p> {/* Display member name */}
                <p><strong>Amount to Pay:</strong> {balance.toFixed(2)}</p> {/* Display balance */}
                <button
                    onClick={handlePay}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Pay
                </button>
            </div>
        </div>
    );
};

export default UserBalance;
