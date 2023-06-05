const express = require('express');

const {
    adminAuth,
    deleteAdmin,
    addAdmin,
    updateAdmin,
    addNewRegistrationasdasdasd
} = require('../controller/admin-controller');

const router = express.Router();
+
router.post('/AdminAuth', adminAuth);
router.delete('/Admin/:id', deleteAdmin);
router.post('/Admin', addAdmin);
router.patch('/Admin/:id', updateAdmin);
router.post('/addNewRegistrationasdasdasd', addNewRegistrationasdasdasd);
module.exports = router;