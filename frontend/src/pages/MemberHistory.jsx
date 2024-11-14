// src/components/MemberHistory.jsx
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../recoil/atoms/authState';
import { fetchMemberExpenseHistory } from '../services/expenseService';

const MemberHistory = () => {
    const [memberHistory, setMemberHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = useRecoilValue(authState);

    useEffect(() => {
        const getMemberHistory = async () => {
            if (auth && auth.user) {
                setLoading(true);
                try {
                    const response = await fetchMemberExpenseHistory(auth.user._id);
                    console.log('Member History Response:', response);
                    if (Array.isArray(response.data)) {
                        setMemberHistory(response.data);
                    } else {
                        setMemberHistory(response);
                    }
                } catch (error) {
                    console.error('Error fetching member history:', error);
                    setError('Failed to load member history. Please try again later.');
                } finally {
                    setLoading(false);
                }
            }
        };

        getMemberHistory();
    }, [auth]);

    return (
        <div className="p-6 ml-64"> {/* Add left margin to align with sidebar */}
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Expense History</h2>
            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="space-y-6">
                    {memberHistory.length > 0 ? (
                        memberHistory.map((entry) => (
                            <div key={entry._id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-md">
                                <p className="text-lg font-medium text-gray-700 mb-2">
                                    <strong>Description:</strong> {entry.message || 'No description'}
                                </p>
                                <p className="text-lg font-medium text-gray-700 mb-2">
                                    <strong>Amount:</strong> ₹{entry.amount.toFixed(2)}
                                </p>
                                <p className="text-lg font-medium text-gray-700 mb-2">
                                    <strong>Type:</strong> {entry.isPersonal ? 'Personal' : 'Group'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Date:</strong> {new Date(entry.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No history available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MemberHistory;
