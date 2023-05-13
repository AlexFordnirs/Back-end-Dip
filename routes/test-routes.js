const express = require('express');

const {
    getTests,
    getTest,
    deleteTest,
    addTest,
    updateTest,
} = require('../controller/test-controller');

const router = express.Router();

router.get('/test', getTests);
router.get('/test/:id', getTest);
router.delete('/test/:id', deleteTest);
router.post('/test', addTest);
router.patch('/test/:id', updateTest);

module.exports = router;