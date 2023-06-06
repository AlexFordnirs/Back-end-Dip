const Teacher = require('../models/teacher');
const bcrypt = require("bcryptjs");
const MailController = require("../mailcom/MailController")
const {checkAuth} = require("./admin-controller");
const handleError = (res, error) => {
    res.status(500).json({ error });
}

const checkAuthTeachers = async (token, req) => {
    let teacher = await Teacher.findOne({'token': token})
    if (teacher) {
        return true
    }  else {
        return false
    }
}

const getTeachers = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Teacher
            .find()
            .sort({title: 1})
            .then((Teacher) => {
                res
                    .status(200)
                    .json(Teacher);
            })
            .catch((err) => handleError(res, err));
    }
    else {
        res.status(401).send('Unauthorized')
    }
};

const getLoginTeacher = async (req, res) => {

    try {
        const teacher = await Teacher.findOne({ login: req.body.login });
        if (teacher) {
            const result = await bcrypt.compare(req.body.password, teacher.password);
            if (result) {
                res
                    .status(200)
                    .json({"token":teacher.token,"id":teacher.id});
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
        await MailController.initActivasion(teacher);
        res.json(teacher);
    } catch (error) {
        res.status(400).json({ error });
    }
};

const getTeacher = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Teacher
            .findById(req.params.id)
            .then((Teacher) => {
                res
                    .status(200)
                    .json(Teacher);
            })
            .catch((err) => handleError(res, err));
    }
    else {
        res.status(401).send('Unauthorized')
    }
};

const deleteTeacher = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Teacher
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

const addTeacher = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
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
    }
    else {
        res.status(401).send('Unauthorized')
    }
};

const updateTeacher =  async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Teacher
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

const addMaterialTeacher = async (req, res) => {
    if (await checkAuthTeachers(req.headers.token, req)) {
        var objFriends = req.body;
        console.log(objFriends)
        Teacher.findOneAndUpdate(
            {_id: req.params.id},
            {$push: {teacher_Material: objFriends}})
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
    getTeachers,
    getTeacher,
    deleteTeacher,
    addTeacher,
    updateTeacher,
    getLoginTeacher,
    addNewRegistrationTeacher,
    addMaterialTeacher
};