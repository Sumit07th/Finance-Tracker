import React, {useEffect, useState} from 'react';
import {AddPersonalExpense, getPersonalExpense, getPersonalHistory} from '../services/personalExpenseService.js';
import {getPersonalIncome} from "../services/authService.js";

const PersonalExpense = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseData, setExpenseData] = useState({
        amount: '',
        message: '',
        category: '',
        paymentMethod: 'Cash',
        isRecurring: false,
        recurrencePeriod: '',
        tags: '',
        notes: ''
    });

    const categories = ['Tour', 'Party', 'House Rent', 'Electricity', 'Groceries', 'Food', 'Health', 'Transportation', 'Education', 'Other'];
    const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Other'];
    const recurrencePeriods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const [balance,setBalance] = useState();
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedPersonalHistory, setSelectedPersonalHistory] = useState([]);
    const [income,setIncome] = useState();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setExpenseData({
            ...expenseData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Fetch income from the backend
    const fetchIncome = async () => {
        try {

            const response = await getPersonalIncome();
            setIncome(response?.data?.income || 0);
        } catch (error) {
            console.error('Error fetching income:', error);
        }
    };

    const handleAddExpense = async () => {
        const { amount, message, category, isRecurring, recurrencePeriod } = expenseData;

        if (!amount || !message || !category) {
            alert('Amount, message, and category are required.');
            return;
        }

        if (isRecurring && !recurrencePeriod) {
            alert('Recurrence period is required for recurring expenses.');
            return;
        }
        console.log('Expense data:', expenseData);

        try {
            const response = await AddPersonalExpense(expenseData);
            console.log('Expense added:', response);
            setIsModalOpen(false);
            setExpenseData({
                amount: '',
                message: '',
                category: '',
                paymentMethod: 'Cash',
                isRecurring: false,
                recurrencePeriod: '',
                tags: '',
                notes: ''
            });
        } catch (error) {
            console.error('Error adding personal expense:', error);
        }
    };

    const fetchBalance = async() => {
        try{
            const response = await getPersonalExpense();
            setBalance(response.data.total);
        }catch(error){
            console.error('Error in getting balance:',error);
        }
    }

    const fetchHistory = async () => {
        try {

            const response = await getPersonalHistory();

            if (Array.isArray(response.data.expenses)) {
                setSelectedPersonalHistory(response.data.expenses);
            } else {
                setSelectedPersonalHistory([]);
            }
            // Open the history modal
            setHistoryModalOpen(true);

        } catch (error) {
            console.error('Error fetching personal history:', error);
            setSelectedPersonalHistory([]);
        }
    };

    useEffect(() => {
        fetchBalance();
        fetchIncome();
    }, []);



    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-6">Personal Expense Tracker</h1>


            <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            >
                Add Personal Expense
            </button>

            <h2 className="text-2xl text-white mt-12">Total Income:
                ₹ {income !== undefined ? income : "Loading..."} </h2>

            <h2 className="text-2xl text-white mt-12">Total Expense:
                ₹ {balance !== undefined ? balance : "Loading..."} </h2>


            <button
                onClick={() => fetchHistory()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none mt-24"
            >
                View History
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Add Personal Expense</h2>

                        {/* Amount Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={expenseData.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Message Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <textarea
                                name="message"
                                value={expenseData.message}
                                onChange={handleChange}
                                placeholder="Enter message"
                                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        {/* Category Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                name="category"
                                value={expenseData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Method Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={expenseData.paymentMethod}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>
                                    Select a payment Method
                                </option>
                                {paymentMethods.map((method, index) => (
                                    <option key={index} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Is Recurring Checkbox */}
                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isRecurring"
                                    checked={expenseData.isRecurring}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Recurring Expense
                            </label>
                        </div>

                        {/* Recurrence Period Dropdown */}
                        {expenseData.isRecurring && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Recurrence Period</label>
                                <select
                                    name="recurrencePeriod"
                                    value={expenseData.recurrencePeriod}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>
                                        Select recurrence period
                                    </option>
                                    {recurrencePeriods.map((period, index) => (
                                        <option key={index} value={period}>
                                            {period}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Tags Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                value={expenseData.tags}
                                onChange={handleChange}
                                placeholder="e.g., vacation, work"
                                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Notes Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Notes</label>
                            <textarea
                                name="notes"
                                value={expenseData.notes}
                                onChange={handleChange}
                                placeholder="Add additional notes"
                                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>


                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleAddExpense}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Add Expense
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {historyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 bg-red-500 text-white py-1 px-2 rounded-full"
                            onClick={() => setHistoryModalOpen(false)}
                        >
                            ×
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            Perosnal Expense History
                        </h2>

                        {/* Expense History Cards */}
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {selectedPersonalHistory.length > 0 ? (
                                selectedPersonalHistory.map((expense) => (
                                    <div
                                        key={expense._id}
                                        className="border rounded-lg p-4 shadow-md bg-gray-50"
                                    >

                                        <p className="text-gray-600">
                                            <span className="font-bold">Amount:</span> ₹{expense.amount}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-bold">Message:</span> {expense.message}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-bold">Category:</span> {expense.category}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-bold">Payment Method:</span> {expense.paymentMethod}
                                        </p>
                                        <p className="text-gray-600">
                                            <span
                                                className="font-bold">Is Recurring:</span> {expense.isRecurring === true ? "Yes" : "No"}
                                        </p>
                                        <p className="text-gray-600">
                                            <span
                                                className="font-bold">Recurrence Period:</span> {expense.recurrencePeriod}
                                        </p>
                                        <p className="text-gray-600">
                                            <span
                                                className="font-bold">Tags:</span> {expense.tags}
                                        </p>
                                        <p className="text-gray-600">
                                            <span
                                                className="font-bold">Notes:</span> {expense.notes}
                                        </p>

                                        <p className="text-gray-600">
                                            <span
                                                className="font-bold">Date:</span> {new Date(expense.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No history available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalExpense;
