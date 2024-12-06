// src/components/AddMemberModal.jsx
import React from 'react';

const AddMemberModal = ({ isOpen, onClose, onSubmit, name, setName, email, setEmail }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Member</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 mb-4"
                    required
                />

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Member
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
