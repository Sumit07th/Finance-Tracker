import axios from 'axios';
const BASE_URL = "https://finance-tracker-six-eta.vercel.app";

const API = axios.create({
    baseURL: BASE_URL,
    timeout: 100000,
    headers: {
        "Content-Type": "application/json"
    }
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token){
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
    }
    ,(error)=>{
    return Promise.reject(error);
}
);

// User Authentication
export const registerUser = (userdata) => API.post("/auth/register", userdata);
export const loginUser = (userdata) => API.post("/auth/login", userdata);
export const logoutUser = () => API.post("/auth/logout");

// User Management (Admin Only)

export const getAllUser = () => API.get("/user/get");
export const addUser = (userdata) => API.post("/user/add", userdata);
export const deleteUser = (userId) => API.delete(`/user/delete/${userId}`);

// Expense Management (Admin only manage the expense whi sb karega)

export const addIndividualExpense = (expenseData) => API.post("/expense/add-individual", expenseData);
export const settleIndividualDebt = (settleData) => API.post("/expense/settle", settleData);
export const addGroupExpense = (groupExpenseData) => API.post("/expense/group", groupExpenseData);

// Expense viewing by both member and admin

export const getMemberBalance = (memberId) => API.get(`expense/balance/${memberId}`);
export const getMemberExpenseHistory = (memberId) => API.get(`expense/history/member/${memberId}`);
export const getAllHistory = () => API.get("expense/history");
