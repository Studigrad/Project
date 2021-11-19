const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const passportLocalMongoose = require('passport-local-mongoose');

const NoteSchema = new Schema({
    title:{
        type: String,
        required: false,
        unique: false
    },
    text:{
        type: String,
        required: false,
        unique: false
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
        }
    
});

module.exports = mongoose.model('Note', NoteSchema);