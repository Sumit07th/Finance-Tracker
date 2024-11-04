import React from 'react';

const UserCard = ({ user, onSettleDebt, onAddPersonalExpense, onDelete }) => (
    <div className="bg-white shadow-md p-4 mb-4">
        <h2>{user.username}</h2>
        <p>Total : {user.balance}</p>
        <button onClick={() => onSettleDebt(user.id)} className="bg-blue-500 text-white p-2 mr-2">Settle Debt</button>
        <button onClick={() => onAddPersonalExpense(user.id)} className="bg-green-500 text-white p-2 mr-2">Add Personal Expense</button>
        <button onClick={() => onDelete(user.id)} className="bg-red-500 text-white p-2">Delete User</button>
    </div>
);

export default UserCard;
