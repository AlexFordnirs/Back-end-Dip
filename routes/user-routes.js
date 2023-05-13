const express = require('express');

const {
    getUsers,
    getUser,
    deleteUser,
    addUser,
    updateUser,
} = require('../controller/user-controller');

const router = express.Router();

router.get('/User', getUsers);
router.get('/User/:id', getUser);
router.delete('/User/:id', deleteUser);
router.post('/User', addUser);
router.patch('/User/:id', updateUser);

module.exports = router;