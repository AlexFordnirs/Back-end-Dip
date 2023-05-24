const Teacher = require('../models/teacher');
const bcrypt = require("bcryptjs");
const handleError = (res, error) => {
    res.status(500).json({ error });
}

const getTeachers = (req, res) => {
    Teacher
        .find()
        .sort({ title: 1 })
        .then((Teacher) => {
            res
                .status(200)
                .json(Teacher);
        })
        .catch((err) => handleError(res, err));
};

const getLoginTeacher = async (req, res) => {

    try {
        const teacher = await Teacher.findOne({ login: req.body.login });
        if (teacher) {
            const result = await bcrypt.compare(req.body.password, teacher.password);
            if (result) {
                res
                    .status(200)
                    .json(true);
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};
const addNewRegistrationTeacher = async (req, res) => {
    try {

        req.body.password = await bcrypt.hash(req.body.password, 10);

        const teacher = await Teacher.create(req.body);

        res.json(teacher);
    } catch (error) {
        res.status(400).json({ error });
    }
};

const getTeacher = (req, res) => {
    Teacher
        .findById(req.params.id)
        .then((Teacher) => {
            res
                .status(200)
                .json(Teacher);
        })
        .catch((err) => handleError(res, err));
};

const deleteTeacher = (req, res) => {
    Teacher
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const addTeacher = async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const teacher = new Teacher(req.body);
    teacher
        .save()
        .then((result) => {
            res
                .status(201)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const updateTeacher =  (req, res) => {
    Teacher
        .findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const addMaterialTeacher = async (req, res) => {
    var objFriends =req.body;
    console.log(objFriends)
    Teacher.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { teacher_Material: objFriends} })
        .then((result) => {
        res
            .status(200)
            .json(result);
    })
        .catch((err) => handleError(res, err));
};

module.exports = {
    getTeachers,
    getTeacher,
    deleteTeacher,
    addTeacher,
    updateTeacher,
    getLoginTeacher,
    addNewRegistrationTeacher,
    addMaterialTeacher
};