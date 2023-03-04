const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//creating scema and validation for adding data to DB
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type: Boolean,
        default:false,
        required:true
    },
    creationdate:{
        type:String,
    },
    tokens:[
        {
        token:{
            type:String
        }
        }
    ],
    messages:[
        {
            name:{
                type:String
            },
            email:{
                type:String
            },
            phone:{
                type:Number
            },
            message:{
                type:String
            }
        }
    ]
});

//hashing password before saving it to DB
userSchema.pre('save',async function (next){
    try {
        if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password.toString(),8);
        }
        next();
    } catch (error) {
        console.log(error)
    }
})

userSchema.methods.generateAuthToken = async function(){
    try {
        const token = await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens= this.tokens.concat({token:token});
        // console.log(token);
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}
userSchema.methods.saveMessage = async function(msg){
    try {
        this.messages= this.messages.concat(msg);
        const res= await this.save();
        return res;
    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model("User",userSchema);

module.exports = User