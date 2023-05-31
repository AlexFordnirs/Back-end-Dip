const User = require('../models/User');
const MailController = require("../mailcom/MailController")
const bcrypt = require("bcryptjs");
const handleError = (res, error) => {
    res.status(500).json({ error });
}

const getUsers = (req, res) => {
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

const getLoginUser = async (req, res) => {

    try {
        const user = await User.findOne({ login: req.body.login });
        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                res
                    .status(200)
                    .json(reb.body.token);
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
const addNewRegistration = async (req, res) => {
    try {

        req.body.password = await bcrypt.hash(req.body.password, 10);
        const token = randomString(16);
        req.body.token = token;
        const user = await User.create(req.body);
       
        res.json(user);
        await MailController.initActivasion(user);
    } catch (error) {
        res.status(400).json({ error });
    }
};

const getUser = (req, res) => {
    User
        .findById(req.params.id)
        .then((User) => {
            res
                .status(200)
                .json(User);
        })
        .catch((err) => handleError(res, err));
};
const getUserToken = (req, res) => {
    User
        .findById(req.params.token)
        .then((User) => {
            res
                .status(200)
                .json(User);
        })
        .catch((err) => handleError(res, err));
};
const deleteUser = (req, res) => {
    User
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const addUser = async (req, res) => {
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

const updateUser =  (req, res) => {
    User
        .findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const addHistoriUser = async (req, res) => {
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
    getUsers,
    getUser,
    deleteUser,
    addUser,
    updateUser,
    getLoginUser,
    addNewRegistration,
    getUserToken,
    addHistoriUser
};