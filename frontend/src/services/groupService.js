
import {createGroup,deleteGroup,deleteMemberFromGroup,addMemberToGroup,getAllGroupMember,getAllGroupForUser,verifyUser} from "../utils/api.js";

export const creategroup = async (groupdata) => {
    try{
        const response = await createGroup(groupdata);
        return response;
    }catch(error){
        console.error("Error adding personal expense",error);
        throw error;
    }
}

export const getAllGroupsforuser = async (memberId) => {
    try{
        const response = await getAllGroupForUser(memberId);
        return response;
    }catch(error){
        console.error("Error getting all group",error);
        throw error;
    }
}

export const deletegroup = async (groupId) => {
    try{
        const response = await deleteGroup(groupId);
        return response;
    }catch(error){
        console.error("Error in deleting group",error);
        throw error;
    }
}

export const getallmember = async (groupId) => {
    try{
        const response = await getAllGroupMember(groupId);
        return response;
    }catch(error){
        console.error("Error in getting member of group",error);
        throw error;
    }
}

export const deletemember = async (groupId,memberId) => {
    try{
        const response = await deleteMemberFromGroup(groupId,memberId);
        return response;
    }catch(error){
        console.error("Error in getting member of group",error);
        throw error;
    }
}

export const verificationUser = async ({email}) => {
    console.log(`Verification user ${email}`);
    try{
        const response = await verifyUser({email});
        return response;
    }catch(error){
        console.error("Error in getting member of group",error);
        throw error;
    }
}

