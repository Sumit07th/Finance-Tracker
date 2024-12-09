import {addPersonalExpense, getTotalPersonalExpense,getPersonalExpenseHistory} from "../utils/api.js";

export const AddPersonalExpense = async (expenseData) => {
    try{
        const response = await addPersonalExpense(expenseData);
        return response;
    }catch(error){
        console.error("Error adding Personal expense",error);
        throw error;
    }
}

export const getPersonalExpense = async () => {
    try{
        const response = await getTotalPersonalExpense();
        return response;
    }catch(error){
        console.error("Error getting Personal expense",error);
        throw error;
    }
}

export const getPersonalHistory = async () => {
    try{
        const response = await getPersonalExpenseHistory();
        return response;
    }catch(error){
        console.error("Error getting Personal expense history",error);
        throw error;
    }
}
