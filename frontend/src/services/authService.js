import {registerUser,loginUser,logoutUser,changedPassword} from "../utils/api.js";


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

export const logout = async () => {
    try {
        await logoutUser();
        localStorage.removeItem('token');
        localStorage.removeItem('authState');
    } catch (error) {
        console.error("Error Logging out user:", error);
        throw error;
    }
};

export const change = async ({oldPassword,newPassword}) => {
    try{
        console.log({oldPassword,newPassword});
        const response = await changedPassword({oldPassword,newPassword});
        return response.data;
    }catch(error){
        console.error("Error Change Password",error);
    }
}

