const mongoose = require('mongoose');

//creating scema and validation for adding data to DB
const userListSchema= new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // room:{
            //     type:Number,
            //     unique:true,
            //     required:true
            // },
    name:{
        type:String,
        required:true
            },
    email: {
        type: String,
        required: true,
        unique: true
            },
    age: {
        type: String,
        required: true
            },
    mobile: {
        type: Number,
        required: true
            }
});

module.exports = mongoose.model("userList",userListSchema);