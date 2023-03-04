const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter first name"]
    },
    lastName: {
        type: String,
        required: [true, "Please enter last name"]
    },
    subject: {
        type: String,
        required: [true, "Please enter subject"]
    },
    email: {
        type: String,
        required: [true, "Please enter valid Email Address"],
        // unique: true,
    },
    city: {
        type: String,
        required: [true, "Please enter city"]
    },
    mobile: {
        type: Number,
        required: [true, "Please enter mobile number"],
        // unique: [true, "Number Already Exist"]
    },
    message: {
        type: String,
        required: [true, "Please enter some message"]
    },
    // profile: {type: String},
})

module.exports = mongoose.model('Contact', ContactSchema)