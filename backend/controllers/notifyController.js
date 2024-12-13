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
        const notifications = await Notification.find({
            receiverId: req.user._id,
            isRead: false
        })
            .populate('senderId', 'username email')
            .populate('groupId', 'name')
            .sort({ createdAt: -1 });


        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};

exports.respondToInvitation = async (req, res) => {
    const { notificationId, response } = req.body;
    console.log("Response notification:", req.body);

    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Check if the notification's receiver is the current logged-in user
        if (notification.receiverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Update the status of the notification
        notification.status = response;
        notification.isRead = true;
        await notification.save();

        // Notify the sender (admin) about the response
        const sender = await User.findById(notification.senderId);
        if (sender) {
            const notificationToSender = new Notification({
                type: 'Invitation Response',
                message: `The member ${req.user.username} has ${response.toLowerCase()} your invitation to join the group: ${notification.groupId.name}`,
                groupId: notification.groupId,
                senderId: req.user._id,
                receiverId: sender._id,
                status: response,
                isRead: false, // Initial state is unread
            });

            // Save the notification for the sender (admin)
            await notificationToSender.save();
        }

        if (response === 'Accepted') {
            // Add the member to the group if the response is 'Accepted'
            const group = await Group.findByIdAndUpdate(
                notification.groupId,
                { $addToSet: { members: req.user._id } },
                { new: true }
            );

            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
        }

        res.status(200).json({ message: `Invitation ${response.toLowerCase()} successfully` });
    } catch (error) {
        console.error('Error responding to invitation:', error);
        res.status(500).json({ message: 'Error responding to invitation', error });
    }
};

exports.closeNotification = async (req, res) => {
    const { notificationId } = req.body;
    console.log("Response notification:", req.body);

    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Check if the notification's receiver is the current logged-in user
        if (notification.receiverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Update the status of the notification
        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: `Invitation ${response.toLowerCase()} successfully` });
    } catch (error) {
        console.error('Error responding to invitation:', error);
        res.status(500).json({ message: 'Error responding to invitation', error });
    }
};
