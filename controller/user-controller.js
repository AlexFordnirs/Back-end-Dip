const Movie = require('../models/User');

const handleError = (res, error) => {
    res.status(500).json({ error });
}

const getUsers = (req, res) => {
    Movie
        .find()
        .sort({ title: 1 })
        .then((movies) => {
            res
                .status(200)
                .json(movies);
        })
        .catch((err) => handleError(res, err));
};

const getUser = (req, res) => {
    Movie
        .findById(req.params.id)
        .then((movie) => {
            res
                .status(200)
                .json(movie);
        })
        .catch((err) => handleError(res, err));
};

const deleteUser = (req, res) => {
    Movie
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const addUser = (req, res) => {
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

const updateUser = (req, res) => {
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
    getUsers,
    getUser,
    deleteUser,
    addUser,
    updateUser,
};