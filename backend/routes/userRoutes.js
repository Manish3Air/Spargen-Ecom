const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    updateUserRole,
} = require('../controllers/userController');

router.get('/', getAllUsers);
router.put('/:id', updateUserRole);

module.exports = router;
