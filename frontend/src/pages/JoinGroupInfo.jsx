import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getallmember } from "../services/groupService.js";
import { MemberBalance } from "../services/expenseService.js";

const JoinGroupInfo = () => {
    const { groupId } = useParams();
    const [groupDetails, setGroupDetails] = useState(null);
    const [balances, setBalances] = useState({});

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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JoinGroupInfo;
