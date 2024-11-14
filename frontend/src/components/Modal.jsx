// src/components/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, title, amount, message, onClose, onSubmit, setAmount, setMessage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">{title}</h2>

                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border p-2 mb-4"
                    required
                />
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border p-2 mb-4"
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
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
