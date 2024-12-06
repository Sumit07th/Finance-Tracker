const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    createGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    getGroupMember,
    deleteGroup,
    getAllGroupsForUser,
    verifyUserByEmail
} = require('../controllers/GroupController');

router.post('/groups', authenticateToken, createGroup);
router.post('/groups/:groupId/:memberId', authenticateToken, addMemberToGroup);
router.delete('/groups/:groupId/member/:memberId', authenticateToken, removeMemberFromGroup);
router.get('/groups/:groupId', authenticateToken, getGroupMember);
router.delete('/groups/delete/:groupId',authenticateToken,deleteGroup);
router.get("/groups/all/:userId", getAllGroupsForUser);
router.post('/groups/verify-email', verifyUserByEmail);


module.exports = router;