const User = require('../models/teacher');
const bcrypt = require("bcryptjs");
const handleError = (res, error) => {
    res.status(500).json({ error });
}

const getTeachers = (req, res) => {
    User
        .find()
        .sort({ title: 1 })
        .then((Users) => {
            res
                .status(200)
                .json(Users);
        })
        .catch((err) => handleError(res, err));
};

const getLoginTeacher = async (req, res) => {

    try {
        const user = await User.findOne({ login: req.body.login });
        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
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

        const user = await User.create(req.body);

        res.json(user);
    } catch (error) {
        res.status(400).json({ error });
    }
};

const getTeacher = (req, res) => {
    User
        .findById(req.params.id)
        .then((User) => {
            res
                .status(200)
                .json(User);
        })
        .catch((err) => handleError(res, err));
};

const deleteTeacher = (req, res) => {
    User
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
    const user = new User(req.body);
    user
        .save()
        .then((result) => {
            res
                .status(201)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const updateTeacher =  (req, res) => {
    User
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
    User.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { user_History: objFriends} })
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