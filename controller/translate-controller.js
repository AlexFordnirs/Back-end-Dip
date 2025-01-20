const Translate = require('../models/Translate');
const {checkAuth} = require("./admin-controller");

const handleError = (res, error) => {
    res.status(500).json({ error });
}

const getTranslates = (req, res) => {
    Translate
        .find({type_name: req.query.type_name, level_name: req.query.level_name})
        .sort({ })
        .then((movies) => {
            res
                .status(200)
                .json(movies);
        })
        .catch((err) => handleError(res, err));
};

const getTranslate = async (req, res) => {
 //   if(await checkAuth(req.headers.token, req)) {
    Translate
            .findById(req.params.id)
            .then((movie) => {
                res
                    .status(200)
                    .json(movie);
            })
            .catch((err) => handleError(res, err));
 /*   }
    else {
        res.status(401).send('Unauthorized')
    }*/
};

const deleteTranslate = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Translate
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

const addTranslate = async (req, res) => {
    // Проверяем авторизацию
    if (await checkAuth(req.headers.token, req)) {
        try {
            // Проверяем, является ли тело запроса массивом
            if (Array.isArray(req.body)) {
                // Сохраняем массив объектов в базе данных
                const tests = await Translate.insertMany(req.body);
                res.status(201).json({
                    message: "Tests successfully added",
                    data: tests
                });
            } else {
                // Если это не массив, сохраняем как один объект
                const test = new Translate(req.body);
                const result = await test.save();
                res.status(201).json({
                    message: "Test successfully added",
                    data: result
                });
            }
        } catch (err) {
            // Обработка ошибок
            handleError(res, err);
        }
    } else {
        // Если авторизация не удалась
        res.status(401).send('Unauthorized');
    }
};

const updateTranslate = async (req, res) => {
    if(await checkAuth(req.headers.token, req)) {
        Translate
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
    getTranslates,
    getTranslate,
    deleteTranslate,
    addTranslate,
    updateTranslate,
};
