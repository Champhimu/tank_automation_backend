const mongoose = require('mongoose');

//creating scema and validation for adding data to DB
const configureDataSchema= new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tankDepth:{
        type: Number,
        required:true
    },
    maxFill:{
        type:Number,
        required:true
    }
});

configureDataSchema.methods.updateData = async function(data){
    try {
        this.tankDepth= data.tankDepth;
        this.maxFill= data.maxFill;
        this.save();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = mongoose.model("configureData",configureDataSchema);