import {sendGroupInvitation, respondToInvitation, getUserNotifications, closeNotification} from "../utils/api.js";

export const sendNotification = async (groupId,email) => {
    try{
        const response = await sendGroupInvitation(groupId,email);
        return response;
    }catch(error){
        console.error("Error sending notification",error);
        throw error;
    }
}

export const getNotification = async () => {
    try{
        const response = await getUserNotifications();
        return response;
    }catch(error){
        console.error("Error getting all notification",error);
        throw error;
    }
}

export const respondNotification = async (respondData) => {
    try{
        const response = await respondToInvitation(respondData);
        return response;
    }catch(error){
        console.error("Error in responding notification",error);
        throw error;
    }
}

export const closedNotification = async (respondData) => {
    try{
        const response = await closeNotification(respondData);
        return response;
    }catch(error){
        console.error("Error updating the notification",error);
        throw error;
    }
}