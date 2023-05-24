const express = require('express');

const {
    getTeachers,
    getTeacher,
    deleteTeacher,
    addTeacher,
    updateTeacher,
    getLoginTeacher,
    addNewRegistrationTeacher,
    addMaterialTeacher
} = require('../controller/teacher-controller');

const router = express.Router();

router.get('/Teacher', getTeachers);
router.get('/Teacherlogin', getLoginTeacher);
router.get('/Teacher/:id', getTeacher);
router.delete('/Teacher/:id', deleteTeacher);
router.post('/Teacher', addTeacher);
router.post('/TeacherRegistration', addNewRegistrationTeacher);
router.patch('/Teacher/:id', updateTeacher);
router.post('/Teacher/:id', addMaterialTeacher);

module.exports = router;