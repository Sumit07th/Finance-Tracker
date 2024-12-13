import {
    registerUser,
    loginUser,
    logoutUser,
    changedPassword,
    addIncome,
    updateIncome,
    getIncome
} from "../utils/api.js";


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
        const response = await changedPassword({oldPassword,newPassword});
        return response.data;
    }catch(error){
        console.error("Error Change Password",error);
    }
}

export const addPersonalIncome = async ({income}) => {
    try{
        const response = await addIncome({income});
        return response.data;
    }catch(error){
        console.error("Error add Income",error);
    }
}

export const updatePersonalIncome = async ({income}) => {
    try{
        const response = await updateIncome({income});
        return response.data;
    }catch(error){
        console.error("Error update Income",error);
    }
}

export const getPersonalIncome = async () => {
    try{
        const response = await getIncome();
        return response;
    }catch(error){
        console.error("Error fetch Income",error);
    }
}

