const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    confirmed: {
        type: Boolean,
        required: true,
    },
    teacher_Material: [{
        type_name: {
            type: String,
        },
        level_name: {
            type: String,
        },
        name_task: {
            type: String,
        },
        title: {
            type: String,
        },
        text: {
            type: String,
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
    }]
});

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;