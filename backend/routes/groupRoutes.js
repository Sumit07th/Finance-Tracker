const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    createGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    getGroupMember,
    deleteGroup
} = require('../controllers/GroupController');

router.post('/groups', authenticateToken, createGroup);
router.post('/groups/:groupId/members', authenticateToken, addMemberToGroup);
router.delete('/groups/:groupId/members/:memberId', authenticateToken, removeMemberFromGroup);
router.get('/groups/:groupId', authenticateToken, getGroupMember);
router.delete('/groups/delete/:groupId',authenticateToken,deleteGroup);

module.exports = router;