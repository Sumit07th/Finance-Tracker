import React, { useEffect, useState } from 'react';
import { fetchAllExpenses } from '../services/expenseService';

function AllHistory() {
    const [history, setHistory] = useState([]);

    // Fetch all history on component mount
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchAllExpenses();
                setHistory(data);
                console.log('history hai',history);
            } catch (error) {
                console.error("Error loading history:", error);
            }
        };
        loadHistory();
    }, []);



    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Expense History</h2>
            <div className="space-y-4">
                {history.length > 0 ? (
                    history.map((entry) => (
                        <div key={entry._id} className="border p-4 rounded shadow">
                            <p><strong>Description:</strong> {entry.message}</p>
                            <p><strong>Amount:</strong> {entry.amount}</p>
                            <p><strong>Type:</strong> {entry.isPersonal ? 'Personal' : 'Group'}</p>
                            {entry.isPersonal && entry.memberId && (
                                <p><strong>Member Name:</strong> {entry.memberId.username}</p>
                            )}
                            <p><strong>Date:</strong> {new Date(entry.createdAt).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No history available.</p>
                )}
            </div>
        </div>
    );
}

export default AllHistory;
