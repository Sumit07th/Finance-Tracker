import {sendGroupInvitation, respondToInvitation, getUserNotifications, getAllGroupForUser} from "../utils/api.js";

export const sendNotification = async (groupId,email) => {
    try{
        const response = await sendGroupInvitation(groupId,email);
        return response;
    }catch(error){
        console.error("Error getting all group",error);
        throw error;
    }
}

export const getNotification = async () => {
    try{
        const response = await getUserNotifications();
        return response;
    }catch(error){
        console.error("Error getting all group",error);
        throw error;
    }
}

export const respondNotification = async (respondData) => {
    try{
        const response = await respondToInvitation(respondData);
        return response;
    }catch(error){
        console.error("Error getting all group",error);
        throw error;
    }
}