const Movie = require('../models/testrw');

const handleError = (res, error) => {
    res.status(500).json({ error });
}

const getTests = (req, res) => {
    Movie
        .find({type_name: req.body.type_name, level_name: req.body.level_name})
        .sort({ })
        .then((movies) => {
            res
                .status(200)
                .json(movies);
        })
        .catch((err) => handleError(res, err));
};

const getTest = (req, res) => {
    Movie
        .findById(req.params.id)
        .then((movie) => {
            res
                .status(200)
                .json(movie);
        })
        .catch((err) => handleError(res, err));
};

const deleteTest = (req, res) => {
    Movie
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const addTest = (req, res) => {
    const movie = new Movie(req.body);
    movie
        .save()
        .then((result) => {
            res
                .status(201)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const updateTest = (req, res) => {
    Movie
        .findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

module.exports = {
    getTests,
    getTest,
    deleteTest,
    addTest,
    updateTest,
};