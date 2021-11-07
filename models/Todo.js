const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    createdDate: {type: Date, required: true},
    completedDate: {type: Date},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
});

//Export model
module.exports = mongoose.model('Todo', ToDoSchema);