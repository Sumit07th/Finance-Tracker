import React, { useState, useEffect } from "react";
import { getAllGroupsforuser, creategroup, deletegroup, getallmember } from "../services/groupService";
import { toast } from "react-toastify";
import { useRecoilValue } from 'recoil';
import { authState } from '../recoil/atoms/authState';
import { useNavigate } from "react-router-dom";

const GroupPage = () => {
    const auth = useRecoilValue(authState);
    const [createdGroups, setCreatedGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [groupMembers, setGroupMembers] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        if (auth && auth.user) {
            try {
                const response = await getAllGroupsforuser(auth.user._id);
                setCreatedGroups(response.data.createdGroups);
                setJoinedGroups(response.data.joinedGroups);

                // Fetch members for all groups
                const allGroups = [...response.data.createdGroups, ...response.data.joinedGroups];
                allGroups.forEach((group) => fetchGroupMembers(group._id));
            } catch (error) {
                console.error("Error fetching groups:", error);
                toast.error("Failed to fetch groups");
            }
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const newGroup = {
                name: groupName,
                description: groupDescription,
            };
            await creategroup(newGroup);
            toast.success("Group created successfully!");
            setModalOpen(false);
            setGroupName("");
            setGroupDescription("");
            fetchGroups(); // Refresh group list
        } catch (error) {
            console.error("Error creating group:", error);
            toast.error("Failed to create group");
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (window.confirm("Are you sure you want to delete this group?")) {
            try {
                await deletegroup(groupId);
                toast.success("Group deleted successfully!");
                setCreatedGroups((prevGroups) => prevGroups.filter((group) => group._id !== groupId)); // Update UI
            } catch (error) {
                console.error("Error deleting group:", error);
                toast.error("Failed to delete group");
            }
        }
    };

    const fetchGroupMembers = async (groupId) => {
        try {
            const response = await getallmember(groupId);
            const groupData = response.data.group;
            setGroupMembers((prev) => ({
                ...prev,
                [groupId]: groupData.members,
            }));
        } catch (error) {
            console.error("Error fetching group members:", error);
            toast.error("Failed to fetch group members");
        }
    };

    const handleCardClick = (groupId, isCreatedGroup) => {
        const route = isCreatedGroup ? `/dashboard/group-info/${groupId}` : `/dashboard/joingroup-info/${groupId}`;
        navigate(route);
    };

    const renderGroupCard = (group, isCreatedGroup) => (
        <div
            key={group._id}
            onClick={() => handleCardClick(group._id, isCreatedGroup)}
            className="cursor-pointer relative border rounded-lg p-6 shadow-lg bg-white hover:shadow-2xl transition-shadow flex flex-col justify-between space-y-4"
        >
            {isCreatedGroup && (
                <button
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md focus:ring-2 focus:ring-red-300 transition-transform transform hover:scale-105"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation
                        handleDeleteGroup(group._id);
                    }}
                    title="Delete Group"
                >
                    Delete
                </button>
            )}

            <div className="mt-4 flex items-center space-x-4">
                <h3 className="text-lg font-semibold">Role:</h3>
                {group.admin === auth.user._id ? (
                    <span className="text-green-600 font-bold">Admin</span>
                ) : (
                    <span className="text-blue-600 font-bold">Member</span>
                )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 truncate">
                {group.name}
            </h2>
            <p className="text-gray-600">
                {group.description || (
                    <span className="italic text-gray-400">
                        No description available.
                    </span>
                )}
            </p>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Members:</h3>
                <ul className="list-disc list-inside text-gray-700">
                    {groupMembers[group._id] ? (
                        groupMembers[group._id].map((member) => (
                            <li key={member._id}>
                                {member.username}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 italic">Loading members...</li>
                    )}
                </ul>
            </div>
        </div>
    );

    return (
        <div className="relative p-4 min-h-screen">
            <button
                className="absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded"
                onClick={() => setModalOpen(true)}
            >
                Create New Group
            </button>

            <h1 className="text-2xl font-bold mb-6">Your Groups</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Created Groups</h2>
                {createdGroups.length > 0 ? (
                    <div className="space-y-6">
                        {createdGroups.map((group) => renderGroupCard(group, true))}
                    </div>
                ) : (
                    <p className="text-gray-500">You haven't created any groups yet.</p>
                )}
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Joined Groups</h2>
                {joinedGroups.length > 0 ? (
                    <div className="space-y-6">
                        {joinedGroups.map((group) => renderGroupCard(group, false))}
                    </div>
                ) : (
                    <p className="text-gray-500">You haven't joined any groups yet.</p>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Create a New Group</h2>
                        <input
                            type="text"
                            placeholder="Group Name"
                            className="border w-full p-2 mb-4 rounded"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <textarea
                            placeholder="Group Description"
                            className="border w-full p-2 mb-4 rounded"
                            rows="3"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 py-2 px-4 rounded"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                                onClick={handleCreateGroup}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupPage;
