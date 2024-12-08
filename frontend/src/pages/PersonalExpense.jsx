import React from 'react';

const PersonalExpense = () => {
    console.log("kaluaa");
    return (
        <div className="relative p-4 min-h-screen">
            <button
                className="absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded"

            >
                Create New Group
            </button>

            <h1 className="text-2xl font-bold mb-6">Your Groups</h1>
        </div>
    )
}

export default PersonalExpense;