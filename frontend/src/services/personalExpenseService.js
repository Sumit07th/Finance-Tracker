import {addPersonalExpense} from "../utils/api.js";

export const AddPersonalExpense = async (expenseData) => {
    try{
        const response = await addPersonalExpense(expenseData);
        return response;
    }catch(error){
        console.error("Error adding Personal expense",error);
        throw error;
    }
}
