import axios from 'axios';
const BASE_URL = "http://localhost:5000/api";

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
export const changedPassword = ({oldPassword,newPassword}) => API.post("/auth/changed-password", {oldPassword,newPassword});

// Group ke liye

export const getAllGroupMember = (groupId) => API.get(`/group/groups/${groupId}`);
export const createGroup = (groupData) => API.post("/group/groups", groupData);
export const deleteMemberFromGroup = (groupId,memberId) => API.delete(`/group/groups/${groupId}/member/${memberId}`);
export const addMemberToGroup = (groupId,memberData) => API.post(`/group/groups/${groupId}`,memberData);
export const deleteGroup = (groupId) => API.delete(`/group/groups/delete/${groupId}`);
export const getAllGroupForUser = (memberId) => API.get(`group/groups/all/${memberId}`);
export const verifyUser = ({email}) => API.post('group/groups/verify-email',{email});

// Expense Management (Admin only manage the expense whi sb karega

export const addIndividualExpense = (expenseData) => API.post("/expense/add-individual", expenseData);
export const settleIndividualDebt = (settleData) => API.post("/expense/settle", settleData);
export const addGroupExpense = (groupExpenseData) => API.post("/expense/group", groupExpenseData);

// Expense viewing by both member and admin


export const getMemberGroupExpenseHistory = (groupId,memberId) => API.get(`expense/history/member/${groupId}/${memberId}`);
export const getGroupExpenseHistory = (groupId) => API.get(`expense/history/group/${groupId}`);
export const getMemberBalance = (groupId,memberId) => API.get(`expense/balance/${groupId}/${memberId}`);


// notification
export const sendGroupInvitation = (groupId, email) => API.post(`/notify/invite/${groupId}`, { email });
export const getUserNotifications = () => API.get("/notify/notifications");
export const respondToInvitation = (responseData) => API.post("/notify/notifications/respond", responseData);
export const closeNotification = (responseData) => API.post("/notify/notifications/close-notifications", responseData);


// personal expense
export const addPersonalExpense = (expenseData) => API.post("/personal/addExpense",expenseData);
export const getPersonalExpenseHistory = () => API.post('/personal/history');
export const getTotalPersonalExpense = () => API.post('/personal/total');
export const getExpensesByCategory = () => API.post('/personal/category-summary');
export const getMonthlyExpenseSummary = () => API.post('/personal/monthly-summary');
