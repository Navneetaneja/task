const mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    event:{
        type:String,
        required:true
    },
    task_category:{
        type:String,
    },
    deadline:{
        type:Date
    }
})

const tasks=mongoose.model('tasks',taskSchema);

module.exports=tasks;