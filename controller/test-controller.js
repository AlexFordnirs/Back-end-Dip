const Test = require('../models/testrw');
const {checkAuth} = require("./admin-controller");

const handleError = (res, error) => {
    res.status(500).json({ error });
}

const getTests = (req, res) => {
    Test
        .find({type_name: req.body.type_name, level_name: req.body.level_name})
        .sort({ })
        .then((movies) => {
            res
                .status(200)
                .json(movies);
        })
        .catch((err) => handleError(res, err));
};

const getTest = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Test
            .findById(req.params.id)
            .then((movie) => {
                res
                    .status(200)
                    .json(movie);
            })
            .catch((err) => handleError(res, err));
    }
    else {
        res.status(401).send('Unauthorized')
    }
};

const deleteTest = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Test
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

const addTest = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        const test = new Test(req.body);
        test
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

const updateTest = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Test
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
    getTests,
    getTest,
    deleteTest,
    addTest,
    updateTest,
};