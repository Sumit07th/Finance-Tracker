import React,{ useState} from 'react';
import {change} from "../services/authService.js"
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {toast} from "react-hot-toast";

const ChangePassword = ({ onCancel }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);




    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            setErrorMessage('Please fill in both old and new passwords');
            return;
        }

        try {
            setSuccessMessage('');
            setErrorMessage('');


            console.log({oldPassword,newPassword})
            const response = await change({oldPassword,newPassword});
            console.log(response);

            if (response.success) {
                toast.success('Password changed successfully');
                setSuccessMessage('Password changed successfully');
                setTimeout(() => {
                    navigate('/dashboard/all-users'); // Navigate to dashboard
                }, 2000);
            } else {
                toast.error('Password change failed');
                setErrorMessage('Password change failed');
            }
        } catch (error) {
            toast.error('Password change failed');
            const errorMsg = error?.response?.data?.message || 'Password change failed';
            setErrorMessage(errorMsg);
        }
    };

    return (
        <div className="border-2 max-w-full p-16 ml-16 bg-white shadow-lg rounded-lg dark:bg-black dark:text-white dark:border-white">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-600">Change Password</h2>

            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2 dark:text-white">Old Password</label>
                    <div className="relative">
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white dark:bg-black"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye}/>
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2 dark:text-white">New Password</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white dark:bg-black"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye}/>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                >
                    Change Password
                </button>

                <button
                    type="button"
                    onClick={onCancel} // Cancel button to hide the form
                    className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg shadow mt-4 hover:bg-gray-500 transition duration-200"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;