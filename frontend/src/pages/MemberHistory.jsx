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
                    // Check if the response is an array or has the data property
                    if (Array.isArray(response.data)) {
                        setMemberHistory(response.data);
                    } else {
                        setMemberHistory(response); // Or setMemberHistory(response.data) based on your API response structure
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
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Expense History</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="space-y-4">
                    {memberHistory.length > 0 ? (
                        memberHistory.map((entry) => (
                            <div key={entry._id} className="border p-4 rounded shadow">
                                <p><strong>Description:</strong> {entry.message || 'No description'}</p>
                                <p><strong>Amount:</strong> {entry.amount}</p>
                                <p><strong>Type:</strong> {entry.isPersonal ? 'Personal' : 'Group'}</p>
                                <p><strong>Date:</strong> {new Date(entry.createdAt).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No history available.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default MemberHistory;
