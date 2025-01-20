const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReadingSchema = new Schema({
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
    text: {
        type: String,
        required: true,
    },
    questions: [{
        question: String,
        query_answer: String,
        options: [
            {
                type: String,
                required: true,
            },
        ],
    }]
});

const test
    = mongoose.model('Reading', ReadingSchema);
module.exports = test;
;