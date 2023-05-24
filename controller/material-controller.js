const Material = require('../models/material');

const handleError = (res, error) => {
    res.status(500).json({ error });
}

const getMaterials = (req, res) => {
    Material
        .find({type_name: req.body.type_name, level_name: req.body.level_name})
        .sort({ })
        .then((movies) => {
            res
                .status(200)
                .json(movies);
        })
        .catch((err) => handleError(res, err));
};

const getMaterial = (req, res) => {
    Material
        .findById(req.params.id)
        .then((movie) => {
            res
                .status(200)
                .json(movie);
        })
        .catch((err) => handleError(res, err));
};

const deleteMaterial = (req, res) => {
    Material
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const addMaterial = (req, res) => {
    const material = new Material(req.body);
    material
        .save()
        .then((result) => {
            res
                .status(201)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

const updateMaterial = (req, res) => {
    Material
        .findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => handleError(res, err));
};

module.exports = {
    getMaterials,
    getMaterial,
    deleteMaterial,
    addMaterial,
    updateMaterial,
};