const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AccountSchema = new Schema({
    balance: Number,
    firstName: String,
    secondName: String,
    addresses:[
        {
         country: String,
         city:String, 
         street: String
        }
    ]
    
});