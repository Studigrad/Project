const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        unique: true
    },
    note:[
        {
        type: Schema.Types.ObjectId,
        ref: 'Note'
        }
    ]
});
UserSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    if(foundUser.password ==password){
        isValid =true
    }
    else {
        isValid =false
    }
    return isValid ? foundUser : false;
}
//UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);