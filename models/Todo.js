const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    createdDate: {type: Date, required: true},
    completedDate: {type: Date},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
});

// SOURCE: https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id
// used to create id instead of _id which was resulting in mismatch on the client side
// Duplicate the ID field.
ToDoSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ToDoSchema.set('toJSON', {
    virtuals: true
});

//Export model
module.exports = mongoose.model('Todo', ToDoSchema);