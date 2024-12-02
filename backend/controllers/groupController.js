const Group = require("../models/Group");
const User = require("../models/User");


exports.createGroup = async (req, res) => {
    const { name, description } = req.body;
    const admin = req.user._id;
    const member= req.user._id;

    try{
        const user = await User.findById(member);
        if(!user){
            return res.status(404).json({message:'Member Not Found'});
        }
        const group = new Group({
            name,
            description,
            admin,
            member
        });

        await group.save();
        res.status(201).json({message:'Group created Sucessfully',group});
    } catch(error){
        console.error('Error creating group',error);
        res.status(500).json({message:'Failed to create group',error});
    }

}

exports.addMemberToGroup = async(req,res) => {
    const {groupId} = req.params;
    const {memberId} = req.body;

    try{
        const user = await User.findById(memberId);
        if(!user){
            return res.status(404).json({message:'Member Not Found'});
        }

        const group = await Group.findByIdAndUpdate(
            groupId,
            {$addToSet:{members:memberId}},
            { new: true }
        ).populate('members','name email');

        if(!group){
            return res.status(404).json({message:'Group Not Found'});
        }
        res.status(200).json({message:'Member added to group successfully',group});
    } catch(error){
        console.error('Error adding member to group',error);
        res.status(500).json({message:'Error adding member to group',error});
    }
}



// Remove a member from a any group
exports.removeMemberFromGroup = async (req, res) => {
    const { groupId, memberId } = req.params;

    try {
        const group = await Group.findByIdAndUpdate(
            groupId,
            { $pull: { members: memberId } },
            { new: true }
        ).populate('members', 'name email');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json({
            message: `Member removed successfully from group`,
            updatedMembers: group.members,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error removing member from group', error });
    }
};

// get lall member of any group

exports.getGroupMember = async(req,res) =>{
    const {groupId} = req.params;

    try{
        const group = await Group.findById(groupId).populate('members','name email');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json({ message: 'Group members retrieved successfully', members: group.members });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving group members', error });
    }
};

// delete a group

exports.deleteGroup = async (req,res) => {
    const {groupId} = req.params;

    try{
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if(group.admin.toString() !== req.user.id){
            return res.status(403).json({message:'You are not authorize to delete the group'})
        }

        await Group.findByIdAndDelete(groupId);
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Error deleting group', error });
    }
};


