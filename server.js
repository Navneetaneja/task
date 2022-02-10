const express=require('express');
const path = require('path');
const PORT=7000;

const app=express();
const database=require('./config/mongoose');
const Tasks=require('./model/task');

app.set('view engine','ejs');
app.set('views',path.join(__dirname+'/views'));

app.use(express.static('./assets'));

app.use(express.urlencoded({extended:true}));


app.get('/signup',function(req,res){
    return res.render('signup');
})

app.post('/addTask',function(req,res){
    Tasks.create(req.body,function(err,data){
        if(err)
        {
            console.log(err);
            return;
        }
        console.log(data);
        return res.redirect('back');
    })
});

app.get('/',function(req,res){

    Tasks.find({},function(err,tasks){
        if(err)
        {
            console.log(err);
            return;
        }
        return res.render('tasks',{tasks:tasks});
    })
})

app.get('/deleteTasks',function(req,res){
    // console.log(req.query.arr);

    const all=req.query.arr.split(",");

    // console.log(all.length);

    if(all[0]!=='')
    {

    for(i of all)
    {
        Tasks.findByIdAndDelete(i,function(err){
            if(err)
            {
                console.log(err);
                return;
            }
        })
    }

    }


    return res.redirect('back');
})



app.listen(PORT,function(err){
    if(err)
    {
        console.log(err);
        return;
    }
    console.log("Server is running at",PORT);
});
