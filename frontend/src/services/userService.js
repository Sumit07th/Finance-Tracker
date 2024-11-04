import { addUser,deleteUser,getAllUser } from "../utils/api";

// get all user
export const fetchAllUsers = async () => {
    try{
        const response = await getAllUser();
        return response.data;
    }
    catch(error){
        console.error("Error in fetching all user",error);
        throw error;
    }
}

// add user

export const createUser = async (userData) => {
    try{
        const response = await addUser(userData);
        return response.data;
    }
    catch (error){
        console.log("Error in adding a member",error);
        throw error;
    }
}

// remove user

export const removeUser = async (userId) => {
    try {
        const response = await deleteUser(userId); // Ensure this function exists
        return response.data;
    } catch (err) {
        console.error("Error in removing a member", err);
        throw err;
    }
};