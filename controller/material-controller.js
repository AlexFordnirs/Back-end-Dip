const Material = require('../models/material');
const {checkAuth} = require("./admin-controller");

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

const getMaterial = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Material
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

const deleteMaterial = async(req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Material
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

const addMaterial = async(req, res) => {
    try {
        // Проверка токена
        if (await checkAuth(req.headers.token, req)) {
            const data = req.body;

            // Проверяем, массив ли передан
            if (Array.isArray(data)) {
                // Сохраняем каждый элемент массива
                const savedMaterials = await Promise.all(
                    data.map(async (item) => {
                        const material = new Material(item);
                        return await material.save();
                    })
                );

                res.status(201).json({
                    message: 'Materials saved successfully',
                    data: savedMaterials,
                });
            } else {
                // Если передан не массив, сохраняем как один объект
                const material = new Material(data);
                const savedMaterial = await material.save();

                res.status(201).json({
                    message: 'Material saved successfully',
                    data: savedMaterial,
                });
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (err) {
        handleError(res, err);
    }
};

const updateMaterial = async(req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Material
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
    getMaterials,
    getMaterial,
    deleteMaterial,
    addMaterial,
    updateMaterial,
};