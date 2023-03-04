const mongoose = require('mongoose');

//DB connection String - (not working for unknown reasons)
// const DB = 'mongodb+srv://mishraraj2003:mishraraj2003@cluster0.0cknvvz.mongodb.net/mernstack?retryWrites=true&w=majority';

mongoose.set('strictQuery',false);  //to remove warnings from mongoose in console
mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log('Connected to DB..');
}).catch((e)=>{
    console.log("Failed to connect! Error: "+e);
})