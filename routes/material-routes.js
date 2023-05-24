const express = require('express');

const {
    getMaterials,
    getMaterial,
    deleteMaterial,
    addMaterial,
    updateMaterial,
} = require('../controller/material-controller');

const router = express.Router();

router.get('/Material', getMaterials);

router.get('/Material/:id', getMaterial);
router.delete('/Material/:id', deleteMaterial);
router.post('/Material', addMaterial);
router.patch('/Material/:id', updateMaterial);
module.exports = router;