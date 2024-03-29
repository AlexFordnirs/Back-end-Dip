const express = require('express');

const {
    getUsers,
    getUser,
    deleteUser,
    addUser,
    updateUser,
    getLoginUser,
    addNewRegistration,
    getUserToken,
    addHistoriUser
} = require('../controller/user-controller');

const router = express.Router();

router.get('/User', getUsers);
router.post('/login', getLoginUser);
router.get('/User/:id', getUser);
router.get('/User/:token', getUserToken);
router.delete('/User/:id', deleteUser);
router.post('/User', addUser);
router.post('/registration', addNewRegistration);
router.patch('/User/:id', updateUser);
router.post('/User/:id', addHistoriUser);

module.exports = router;