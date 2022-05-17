const mongoose=require('mongoose');

mongoose.connect(${{URL}});

const db=mongoose.connection;

db.on('error',console.error.bind(console,"error in connecting database"));

db.once('open',function(){
    console.log("Database connected successfully");
})


