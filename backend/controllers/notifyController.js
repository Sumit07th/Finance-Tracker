const Group = require("../models/Group");
const User = require("../models/User");
const Notification = require("../models/Notify");

exports.sendGroupInvitation = async (req, res) => {
    const {groupId} = req.params;
    const {email} = req.body;

    try{

    const receiver = await User.findOne({email});
    if(!receiver){
        return res.status(404).json({ message: 'User not found' });
    }

    const group = await Group.findById(groupId);
    if(!group){
        return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(receiver._id)) {
        return res.status(400).json({ message: 'User is already a member of the group' });
    }

    const notification = new Notification({
        type: 'Group Invitation',
        message: `You have been invited to join the group: ${group.name}`,
        groupId,
        senderId: req.user._id,
        receiverId: receiver._id,
    });
    await notification.save();
    res.status(200).json({ message: 'Invitation sent successfully', notification });
    } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ message: 'Error sending invitation', error });
}
};

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiverId: req.user._id })
            .populate('senderId', 'username email')
            .populate('groupId', 'name')
            .sort({ createdAt: -1 });
        console.log("notifications is ", notifications)

        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};

exports.respondToInvitation = async (req, res) => {
    const { notificationId, response } = req.body;
    console.log("respons notif", req.body)

    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.receiverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        if (response === 'Accepted') {
            const group = await Group.findByIdAndUpdate(
                notification.groupId,
                { $addToSet: { members: req.user._id } },
                { new: true }
            );

            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
        }

        notification.status = response;
        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: `Invitation ${response.toLowerCase()} successfully` });
    } catch (error) {
        console.error('Error responding to invitation:', error);
        res.status(500).json({ message: 'Error responding to invitation', error });
    }
};

