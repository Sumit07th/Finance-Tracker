import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getallmember, deletemember,verificationUser } from "../services/groupService.js";
import {
    MemberBalance,
    addPersonalExpense,
    settleDebt,
    addExpenseForGroup,
    getMemberHistoryOfGroup
} from "../services/expenseService.js";
import {sendNotification} from "../services/notifyService.js";
import Modal from "../components/Modal.jsx";
import AddMemberModal from "../components/AddMemberModal.jsx";

const GroupInfo = () => {
    const { groupId } = useParams();
    const [groupDetails, setGroupDetails] = useState(null);
    const [balances, setBalances] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGroupExpenseModalOpen, setIsGroupExpenseModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [actionType, setActionType] = useState(null);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedPersonalHistory, setSelectedPersonalHistory] = useState([]);
    const [selectedMemberName, setSelectedMemberName] = useState("");

    useEffect(() => {
        fetchGroupDetails();
    }, [groupId]);

    const fetchGroupDetails = async () => {
        try {
            const response = await getallmember(groupId);
            const groupData = response.data.group;
            setGroupDetails({
                name: groupData.name,
                description: groupData.description,
                members: groupData.members,
            });

            fetchMemberBalance(groupData.members);
        } catch (error) {
            console.error("Error fetching group details:", error);
            toast.error("Failed to fetch group details");
        }
    };

    const fetchMemberBalance = async (members) => {
        try {
            const updatedBalances = {};
            const balancePromises = members.map(member =>
                MemberBalance(groupId, member._id).then(response => {
                    updatedBalances[member._id] = response.balance;
                })
            );

            await Promise.all(balancePromises);
            setBalances(updatedBalances);
        } catch (error) {
            console.error("Error fetching member balances:", error);
            toast.error("Failed to fetch member balances");
        }
    };

    const handleOpenModal = (member,type) => {
        setSelectedMember(member);
        setIsModalOpen(true);
        setActionType(type);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setActionType(null);
        setAmount("");
        setMessage("");
        setSelectedMember(null);
        setIsGroupExpenseModalOpen(false);
        setIsAddMemberModalOpen(false);
        setEmail("");
    };

    const handleAddMember = async () => {
        if (!email) {
            toast.error("Please enter an email");
            return;
        }

        try {
            const userExists = await verificationUser({email}); // Verify if user exists
            console.log(userExists)
            if (userExists) {
                await sendNotification(groupId, email); // Send notification
                toast.success("Notification sent to the user");
                handleCloseModal();
            } else {
                toast.error("User not found");
            }
        } catch (error) {
            console.error("Error adding member:", error);
            toast.error("Failed to send notification");
        }
    };

    const handleAddExpense = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        try {
            const data = {
                groupId,
                amount: parseFloat(amount),
                memberId: selectedMember._id,
                message,
            };
            await addPersonalExpense(data);
            toast.success(`Expense of ${amount} added for ${selectedMember.username}`);
            handleCloseModal();
            fetchMemberBalance(groupDetails.members);
        } catch (error) {
            console.error("Error adding expense:", error);
            toast.error("Failed to add expense");
        }
    };

    const handleSettleDebt = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid positive amount");
            return;
        }
        try {
            const data = {
                groupId,
                memberId: selectedMember._id,
                amount: parseFloat(amount),
                message,
            };
            await settleDebt(data);
            toast.success(`Debt of ${amount} settled for ${selectedMember.username}`);
            handleCloseModal();
            fetchMemberBalance(groupDetails.members);
        } catch (error) {
            console.error("Error settling debt:", error);
            toast.error("Failed to settle debt");
        }
    };

    const handleAddGroupExpense = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        try {
            const data = {
                groupId,
                amount: parseFloat(amount),
                message,
            };
            await addExpenseForGroup(data);
            toast.success(`Group expense of ${amount} added`);
            handleCloseModal();
            fetchMemberBalance(groupDetails.members);
        } catch (error) {
            console.error("Error adding group expense:", error);
            toast.error("Failed to add group expense");
        }
    };

    const handleDeleteMember = async (memberId) => {
        try {
            await deletemember(groupId, memberId);
            toast.success('Member removed');
            fetchGroupDetails();
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove member");
        }
    };

    const fetchMemberHistory = async (memberId,MemberName) => {
        try {
            const response = await getMemberHistoryOfGroup(groupId,memberId);
            console.log(response.history);
            if (response.status === 200 && Array.isArray(response.history) && response.history.length === 0) {
                console.log("No history available for this group.");
                setSelectedPersonalHistory([]);
                setSelectedMemberName(MemberName);
                setHistoryModalOpen(true);
                return;
            }
            if (Array.isArray(response.history)) {
                setSelectedPersonalHistory(response.history);
            } else {
                setSelectedPersonalHistory([]); // Fallback to an empty array if the response is not valid
            }
            setSelectedMemberName(MemberName);
            setHistoryModalOpen(true);
        } catch (error) {
            console.error("Error fetching group history:", error);
            toast.error("Failed to fetch group history");
            setSelectedPersonalHistory([]); // Set to empty on error
        }
    };

    if (!groupDetails) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Group Name: {groupDetails.name}</h1>
                    <p className="text-gray-600">Description: {groupDetails.description}</p>
                </div>
                <div className="space-x-4">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                        onClick={() => setIsGroupExpenseModalOpen(true)}
                    >
                        Add Group Expense
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded"
                        onClick={() => setIsAddMemberModalOpen(true)}
                    >
                        Add Member
                    </button>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Group Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
                {groupDetails.members.map((member) => (
                    <div
                        key={member._id}
                        className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow flex flex-col justify-between h-full"
                    >
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{member.username}</h3>
                            <p className="text-gray-600">{member.email}</p>
                            <p className="text-gray-800 font-semibold">
                                Balance: ₹ {balances[member._id] !== undefined ? balances[member._id] : "Loading..."}
                            </p>
                            <div className="flex justify-between mt-2">
                                <button
                                    className="bg-blue-500 text-white py-1 px-4 rounded"
                                    onClick={() => handleOpenModal(member, "expense")}
                                >
                                    Add Expense
                                </button>
                                <button
                                    className="bg-green-500 text-white py-1 px-4 rounded"
                                    onClick={() => handleOpenModal(member, "settle")}
                                >
                                    Settle Amount
                                </button>
                                <button
                                    className="bg-red-500 text-white py-1 px-4 rounded"
                                    onClick={() => handleDeleteMember(member._id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-yellow-500 text-white py-1 px-4 rounded"
                                    onClick={() => fetchMemberHistory(member._id,member.username)}
                                >
                                    View History
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleAddMember}
                email={email}
                setEmail={setEmail}
            />


            <Modal
                isOpen={isModalOpen}
                title={actionType === "expense" ? `Add Expense for ${selectedMember?.username}` : `Settle Debt for ${selectedMember?.username}`}
                amount={amount}
                message={message}
                onClose={handleCloseModal}
                onSubmit={actionType === "expense" ? handleAddExpense : handleSettleDebt}
                setAmount={setAmount}
                setMessage={setMessage}
            />


            <Modal
                isOpen={isGroupExpenseModalOpen}
                title={`Add Group Expense`}
                amount={amount}
                message={message}
                onClose={handleCloseModal}
                onSubmit={handleAddGroupExpense}
                setAmount={setAmount}
                setMessage={setMessage}
            />

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
                            {selectedMemberName} - Expense History
                        </h2>

                        {/* Expense History Cards */}
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {selectedPersonalHistory.length > 0 ? (
                                selectedPersonalHistory.map((expense) => (
                                    <div
                                        key={expense._id}
                                        className="border rounded-lg p-4 shadow-md bg-gray-50"
                                    >
                                        <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                            {expense.isPersonal ? "Personal Expense" : "Group Expense"}
                                        </h3>
                                        <p className="text-gray-600">
                                            <span className="font-bold">Amount:</span> ₹{expense.amount}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-bold">Message:</span> {expense.message}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-bold">Added To:</span> {expense.member}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-bold">Added By:</span> {expense.admin}
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

export default GroupInfo;
