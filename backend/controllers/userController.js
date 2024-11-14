const User = require('../models/User');
const {hashedPassword} = require('../utils/hashUtils');

exports.getAllUsers = async (req, res) => {
    const adminId = req.user._id; // Get the admin's ID from the authenticated user
    try {
        const users = await User.find({ adminId: adminId, role: 'member' }); // Fetch only members of this admin
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

exports.addUser = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPass = await hashedPassword(password);

    try {
        const user = new User({
            username,
            email,
            password: hashedPass,
            adminId: req.user.role === 'admin' ? req.user._id : undefined,
        });
        await user.save();
        res.status(201).json({message: "User add Sucessfully"});
    }
    catch(error){
        res.status(500).json({message:'User not add'})
        console.log(error);
    }
}
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
