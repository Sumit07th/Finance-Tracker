import {registerUser,loginUser,logoutUser,addUser,deleteUser,getAllUser} from "../utils/api.js";

// Register a new user
export const register = async (userData) => {
    try{
        const response = await registerUser(userData);
        return response.data;
    }
    catch(error){
        console.error("Error registering user ",error);
        throw error;
    }
}

// login a user

export const login = async (userData) => {
    try {
        const response = await loginUser(userData);
        const {token} = response.data;
        localStorage.setItem('token', token);
        return response.data;
    }
    catch(error){
        console.error("Error Login in user",error);
        throw error;
    }
}

// logout user
export const logout = async () => {
    try{
        await logoutUser();
        localStorage.removeItem('token');
    }
    catch(error){
        console.error("Error Logout user",error);
        throw error;
    }
}

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

export const removeUser = async (memberId) => {
    try{
        const response = await deleteUser(memberId);
        return response.data;
    }
    catch (error){
        console.log("Error in removing a member",error);
        throw error;
    }

}