const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    type: {
        type: Boolean,
    }
});

const Material = mongoose.model('material', materialSchema);
module.exports = Material;