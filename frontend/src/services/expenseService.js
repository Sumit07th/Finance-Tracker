import {addIndividualExpense,settleIndividualDebt,addGroupExpense,getMemberBalance,getMemberGroupExpenseHistory,getGroupExpenseHistory} from "../utils/api.js";

// add member personal expense
export const addPersonalExpense = async (expenseData) => {
    try{
        const response = await addIndividualExpense(expenseData);
        return response;
    }
    catch(err){
        console.error("Error adding personal expense",err);
        throw err;
    }
}

// settle personal debt of member
export const settleDebt = async (debtData) => {
    try {
        const response = await settleIndividualDebt(debtData);
        return response.data;
    }
    catch(err){
        console.error("Error adding personal debt",err);
        throw err;
    }
}

// add expense for group that is split into each memeber equally
export const addExpenseForGroup = async (groupData) => {
    try {
        const response = await addGroupExpense(groupData);
        return response.data;
    }
    catch (err) {
        console.error("Error adding group expense",err);
        throw err;

    }
}

// Get balance for a specific member (total of personal and group expenses)
export const MemberBalance = async (groupId,memberId) => {
    try {
        const response = await getMemberBalance(groupId,memberId);
        return response.data;
    } catch (error) {
        console.error("Error fetching member balance:", error);
        throw error;
    }
};

export const getMemberHistoryOfGroup = async (groupId,memberId) => {
    try {
        const response = await getMemberGroupExpenseHistory(groupId,memberId);
        return response.data;
    } catch (error) {
        console.error("Error fetching member balance:", error);
        throw error;
    }
};

export const getGroupHistory = async (groupId) => {
    try {
        const response = await getGroupExpenseHistory(groupId);
        return response.data;
    } catch (error) {
        console.error("Error fetching member balance:", error);
        throw error;
    }
};


/*
// Get entire expense history for a specific member
export const fetchMemberExpenseHistory = async (memberId) => {
    try {
        const response = await getMemberExpenseHistory(memberId);
        return response.data;
    } catch (error) {
        console.error("Error fetching member expense history:", error);
        throw error;
    }
};

// Get general expense history for the admin
export const fetchAllExpenses = async () => {
    try {
        const response = await getAllHistory();
        return response.data;
    } catch (error) {
        console.error("Error fetching all expense history:", error);
        throw error;
    }
};

 */