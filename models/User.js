const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    Username & Email have a forced stength level of 2 to perform case-insensitive validations
*/
const UserSchema = new Schema({
    username: {type: String, required: true, unique: true, strength: 2}, 
    email: {type: String, required: true, unique: true, strength: 2},
    password: {type: String, required: true,},
    todo: [{type: Schema.Types.ObjectId, ref: 'Todo'}],
    profileImage: {type: String, required: false}
});

// export model
module.exports = mongoose.model('User', UserSchema);
