const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
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
    title: {
        type: String,
        required: false,
    },
    text: {
        type: String,
        required: true,
    },
    answer: [{
        question: String,
        query_answer: String,
        answer_1: String,
        answer_2: String,
        answer_3: String,
        answer_4: String,
        answer_5: String,
    }]
});

const test
    = mongoose.model('test', testSchema);
module.exports = test;
;