// src/pages/AllUsers.jsx
import React, { useEffect, useState } from 'react';
import { fetchAllUsers, createUser, removeUser } from '../services/userService';
import { addPersonalExpense, settleDebt, fetchMemberBalance } from '../services/expenseService';
import Modal from '../components/Modal';

function AllUsers() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
    const [balances, setBalances] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);

    // Fetch all users and their balances on component mount
    useEffect(() => {
        const loadUsersAndBalances = async () => {
            try {
                const usersData = await fetchAllUsers();
                setUsers(usersData);

                const balancesData = {};
                await Promise.all(usersData.map(async (user) => {
                    const response = await fetchMemberBalance(user._id);
                    balancesData[user._id] = response.balance;
                }));
                setBalances(balancesData);
            } catch (error) {
                console.error("Error loading users or balances:", error);
            }
        };

        loadUsersAndBalances();
    }, []);

    // Handle new user form input
    const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    // Add new user
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(newUser);
            setNewUser({ username: '', email: '', password: '' });
            const updatedUsers = await fetchAllUsers();
            setUsers(updatedUsers);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        try {
            await removeUser(userId);
            setUsers(users.filter(user => user._id !== userId));
            const updatedBalances = { ...balances };
            delete updatedBalances[userId];
            setBalances(updatedBalances);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // Open modal for "Settle Debt" or "Add Expense"
    const openModal = (userId, action) => {
        setCurrentUserId(userId);
        setModalTitle(action === 'settleDebt' ? 'Settle Debt' : 'Add Expense');
        setIsModalOpen(true);
    };

    // Handle modal submission
    const handleSubmit = async () => {
        try {
            if (modalTitle === 'Add Expense') {
                await addPersonalExpense({ memberId: currentUserId, amount, message });
                alert("Expense added successfully!");
            } else {
                await settleDebt({ memberId: currentUserId, amount });
                alert("Debt settled successfully!");
            }

            // Refresh balance for the user
            const updatedBalance = await fetchMemberBalance(currentUserId);
            setBalances(prevBalances => ({ ...prevBalances, [currentUserId]: updatedBalance.balance }));

            // Close modal and reset fields
            setIsModalOpen(false);
            setAmount('');
            setMessage('');
        } catch (error) {
            console.error(`Error ${modalTitle === 'Add Expense' ? 'adding expense' : 'settling debt'}:`, error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">All Users</h2>

            <form onSubmit={handleAddUser} className="mb-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="border p-2 mr-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div key={user._id} className="border rounded p-4 shadow">
                        <h3 className="text-lg font-semibold">{user.username}</h3>
                        <p className="text-gray-600">Balance: ₹ {balances[user._id] ?? 'Loading...'}</p>
                        <button
                            onClick={() => openModal(user._id, 'settleDebt')}
                            className="bg-green-500 text-white px-3 py-1 rounded mt-2 mr-2"
                        >
                            Settle Debt
                        </button>
                        <button
                            onClick={() => openModal(user._id, 'addExpense')}
                            className="bg-yellow-500 text-white px-3 py-1 rounded mt-2 mr-2"
                        >
                            Add Expense
                        </button>
                        <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                        >
                            Delete User
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal Component */}
            <Modal
                isOpen={isModalOpen}
                title={modalTitle}
                amount={amount}
                message={message}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                setAmount={setAmount}
                setMessage={setMessage}
            />
        </div>
    );
}

export default AllUsers;
