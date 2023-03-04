const mongoose = require('mongoose');

//creating scema and validation for adding data to DB
const supplyListSchema= new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomList:[
        {   
            wing:{
                type:String,
                required:true
            },
            room:{
                type:Number,
                // unique:true,
                required:true
            },
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required: true
            },
            age:{
                type:String,
                required: true
            },
            mobile: {
                type: Number,
                required: true
            },
            ownership: {
                type: String,
                required: true
            },
            status: {
                type: String,
                required: true
            },
            supplyOn:{
                type:Boolean,
                default: false,
                required:true
            }
        }
    ]
});

supplyListSchema.methods.updateList = async function(owner,list){
    try {
        if(list){
            this.owner= owner
            this.roomList= list;
            this.save();
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = mongoose.model("supplyList",supplyListSchema);