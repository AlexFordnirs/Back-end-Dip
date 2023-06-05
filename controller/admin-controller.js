const Admin = require('../models/admin');
const bcrypt = require("bcryptjs");
const crypto = require('node:crypto');
const MailController = require("../mailcom/MailController");

const handleError = (res, error) => {
    res.status(500).json({ error });
}
const checkAuth = async (token, req) => {
    let admin = await Admin.findOne({'token': token})
    if (admin) {
        return true
    }  else {
        return false
    }
}


const addNewRegistrationasdasdasd = async (req, res) => {
    try {

        req.body.password = await bcrypt.hash(req.body.password, 10);
        const user = await Admin.create(req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error });
    }
};




const adminAuth =  async (req, res) => {
    try {
        const user = await Admin.findOne({ login: req.body.login });
       /* req.body.password = await bcrypt.hash(req.body.password, 10);
        console.log(await bcrypt.hash(req.body.password, 10));*/
        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
            console.log(req.body.password);
            console.log(await bcrypt.hash(req.body.password, 10));
            console.log(user.password);
            if (result) {
               user.token = (await crypto.randomBytes(20)).toString('hex')
                await user.save();
                res
                    .status(200)
                    .json(user.token);
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
        console.log(error)
    }
};

const deleteAdmin = async (req, res) => {
    if(await checkAuth(req.headers.token, req)){
        Admin
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

const addAdmin = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        const movie = new Admin(req.body);
        movie
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

const updateAdmin = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Admin
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

module.exports = {
    adminAuth,
    deleteAdmin,
    addAdmin,
    updateAdmin,
    checkAuth,
    addNewRegistrationasdasdasd
};