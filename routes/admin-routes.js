const express = require('express');

const {
    getAdmins,
    getAdmin,
    deleteAdmin,
    addAdmin,
    updateAdmin
} = require('../controller/admin-controller');

const router = express.Router();

router.get('/Admin', getAdmins);

router.get('/Admin/:id', getAdmin);
router.delete('/Admin/:id', deleteAdmin);
router.post('/Admin', addAdmin);
router.patch('/Admin/:id', updateAdmin);
module.exports = router;