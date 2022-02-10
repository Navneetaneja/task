const mongoose=require('mongoose');

mongoose.connect("mongodb+srv://user:navneet2001@cluster0.drir7.mongodb.net/TaskDB");

const db=mongoose.connection;

db.on('error',console.error.bind(console,"error in connecting database"));

db.once('open',function(){
    console.log("Database connected successfully");
})


