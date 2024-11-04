import React,{useState,useEffect} from 'react';
import {createUser} from "../services/userService.js";

function AddUser(){
    const [newUser, setNewUser] = useState({username:'',email:'',password:''});

    const handleInputChange = (e) => {
        setNewUser({...newUser, [e.target.name]: e.target.value});
    }

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(newUser);
            alert("User Added Sucessfully!");
            setNewUser({username: '', email: '', password: ''});
        } catch (e) {
            console.error("Error adding user:", e);
            alert("Failed to add User");
            
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
                <label className="block text-gray-700 mb-2">UserName</label>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                    required
                />
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                    required
                />
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
            </form>

        </div>
    )
}

export default AddUser;