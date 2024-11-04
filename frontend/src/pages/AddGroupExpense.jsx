// src/pages/AddGroupExpense.jsx
import React, { useState, useEffect } from 'react';
import { fetchAllUsers } from '../services/userService'; // Import function to fetch users
import { addExpenseForGroup } from '../services/expenseService'; // Import function to add group expense

function AddGroupExpense() {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all users on component mount
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const users = await fetchAllUsers();
                const userIds = users.map(user => user._id); // Extract user IDs for participants
                setParticipants(userIds);
            } catch (error) {
                console.error("Error loading users:", error);
                alert("Failed to load users for participants.");
            }
        };
        loadUsers();
    }, []);

    // Handle form submission
    const handleAddExpense = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send request to add group expense with populated participants
            await addExpenseForGroup({ participants, amount, message });
            alert(`Group expense of ${amount} added and split among ${participants.length} participants.`);
            setAmount('');
            setMessage('');
        } catch (error) {
            console.error("Error adding group expense:", error);
            alert("Failed to add group expense.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Add Group Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
                <input
                    type="number"
                    name="amount"
                    placeholder="Total Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="text"
                    name="message"
                    placeholder="Expense Message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border p-2 w-full"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Expense'}
                </button>
            </form>
        </div>
    );
}

export default AddGroupExpense;
