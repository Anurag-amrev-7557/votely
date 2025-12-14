const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    bulkUpdateUsers
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and require admin privileges
router.use(protect);
router.use(admin);

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.post('/bulk-update', bulkUpdateUsers);
router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
