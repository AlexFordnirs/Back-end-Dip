const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TranslateSchema = new Schema({
    type_name: {
        type: String,
        required: true,
    },
    level_name: {
        type: String,
        required: true,
    },
    name_task: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: false,
    },
    questions: [{
        text: String,
        query_answer: String
    }]
});

const test
    = mongoose.model('Translate', TranslateSchema);
module.exports = test;
;