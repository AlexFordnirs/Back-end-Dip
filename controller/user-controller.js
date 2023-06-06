const User = require('../models/User');
const MailController = require("../mailcom/MailController")
const bcrypt = require("bcryptjs");
const {checkAuth} = require("./admin-controller");
const Admin = require("../models/admin");

const handleError = (res, error) => {
    res.status(500).json({ error });
}

const checkAuthUser = async (token, req) => {
    let user = await User.findOne({'token': token})
    if (user) {
        return true
    }  else {
        return false
    }
}

function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}
const getUsers = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        User
            .find()
            .sort()
            .then((Users) => {
                res
                    .status(200)
                    .json(Users);
            })
            .catch((err) => handleError(res, err));
    }
    else {
        res.status(401).send('Unauthorized')
    }
};

const getLoginUser = async (req, res) => {
    try {
        const user = await User.findOne({ login: req.body.login });
        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                res
                    .status(200)
                    .json({"token":user.token,"id":user.id});
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

        req.body.token =randomString(24);
        const user = await User.create(req.body);
       
        res.json(user);
        await MailController.initActivasion(user);
    } catch (error) {
        res.status(400).json({ error });
    }
};

const getUser = async (req, res) => {
    if(await checkAuthUser(req.headers.token, req)) {
        User
            .findById(req.params.id)
            .then((User) => {
                res
                    .status(200)
                    .json(User);
            })
            .catch((err) => handleError(res, err));
    }
    else {
        res.status(401).send('Unauthorized')
    }
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
const deleteUser = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        User
            .findByIdAndDelete(req.params.id)
            .then((result) => {
                res
                    .status(200)
                    .json(result);
            })
            .catch((err) => handleError(res, err));
    }
    else {
        res.status(401).send('Unauthorized')
    }
};

const addUser = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
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
    }
    else {
        res.status(401).send('Unauthorized')
    }
};

const updateUser =  async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        User
            .findByIdAndUpdate(req.params.id, req.body)
            .then((result) => {
                res
                    .status(200)
                    .json(result);
            })
            .catch((err) => handleError(res, err));
    }
    else {
        res.status(401).send('Unauthorized')
    }
};

const addHistoriUser = async (req, res) => {

    if (await checkAuthUser(req.headers.token, req)) {

        var objFriends = req.body;
        console.log(objFriends)
        User.findOneAndUpdate(
            {_id: req.params.id},
            {$push: {user_History: objFriends}})
            .then((result) => {
                res
                    .status(200)
                    .json(result);
            })
            .catch((err) => handleError(res, err));
    } else {
        res.status(401).send('Unauthorized')
    }
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