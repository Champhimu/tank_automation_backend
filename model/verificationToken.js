const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//creating scema and validation for adding data to DB
const verificationTokenSchema= new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token:{
        type: String,
        required:true
    },
    createdAt:{
        type:Date,
        expires:3600,
        default:Date.now()
    }
});

//hashing password before saving it to DB
verificationTokenSchema.pre('save',async function (next){
    try {
        if(this.isModified('token')){
        this.token = await bcrypt.hash(this.token.toString(),8);
        }
        next();
    } catch (error) {
        console.log(error)
    }
})

verificationTokenSchema.methods.compareToken = async function(token){
    const result= await bcrypt.compare(`${token}`,this.token);
    return result;
}

module.exports = mongoose.model("verificationToken",verificationTokenSchema);