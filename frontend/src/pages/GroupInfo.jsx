import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getallmember, deletemember } from "../services/groupService.js";
import { MemberBalance, addPersonalExpense, settleDebt, addExpenseForGroup } from "../services/expenseService.js";
import Modal from "../components/Modal.jsx";

const GroupInfo = () => {
    const { groupId } = useParams();
    const [groupDetails, setGroupDetails] = useState(null);
    const [balances, setBalances] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGroupExpenseModalOpen, setIsGroupExpenseModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [actionType, setActionType] = useState(null);

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
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => setIsGroupExpenseModalOpen(true)}
                >
                    Add Group Expense
                </button>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Group Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupDetails.members.map((member) => (
                    <div
                        key={member._id}
                        className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-lg font-bold text-gray-800">{member.username}</h3>
                        <p className="text-gray-600">{member.email}</p>
                        <p className="text-gray-800 font-semibold">
                            Balance: ₹ {balances[member._id] !== undefined ? balances[member._id] : "Loading..."}
                        </p>
                        <div className="flex justify-between mt-2">
                            <button
                                className="bg-blue-500 text-white py-1 px-4 rounded"
                                onClick={() => handleOpenModal(member,"expense")}
                            >
                                Add Expense
                            </button>
                            <button
                                className="bg-green-500 text-white py-1 px-4 rounded"
                                onClick={() => handleOpenModal(member,"settle")}
                            >
                                Settle Amount
                            </button>
                            <button
                                className="bg-red-500 text-white py-1 px-4 rounded"
                                onClick={() => handleDeleteMember(member._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>


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
        </div>
    );
};

export default GroupInfo;
