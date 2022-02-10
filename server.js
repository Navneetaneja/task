const express = require('express');
const path = require('path');
const PORT = 7000;

const app = express();
const database = require('./config/mongoose');
const Tasks = require('./model/task');
const passport = require('passport');
const passportlocal = require('./config/passport_local');
const User = require('./model/user');
const session = require('express-session');
const cookieparser=require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

app.use(session({
    name: 'login',
    secret: 'xyz',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.use(cookieparser());
app.use(express.static('./assets'));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticationUser);

var error="";

app.get('/', passport.checkAuthentication, function (req, res) {
    Tasks.find({userid:res.locals.user._id}, function (err, tasks) {
        if (err) {
            console.log(err);
            return res.redirect('/signin');
        }
        return res.render('tasks', { tasks: tasks });
    })
})

app.get('/signin', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    error="";
    return res.render('signin');
})

app.get('/signup', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('signup',{error:error});
})

app.get('/signout',function(req,res){
    req.logOut();
    error="";
    return res.redirect('/signin');
})

app.post('/createUser', function (req, res) {

    if (req.body.password !== req.body.confirm_password) {
        console.log("password not matched");
        error="Passwords Not Matched";
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log(err);
            return;
        }
        if (!user) {
            User.create(req.body, function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
                else
                {
                    error="";
                    return res.redirect('/signin');
                }
            });
        }
        else {
            error="User Already Exists";
            return res.redirect('/signup');
        }
    })

})

app.post("/userLogin", passport.authenticate('local', { failureRedirect: "/signin" }), function (req, res) {
    error="";
    return res.redirect('/');
})


app.post('/addTask', function (req, res) {
    req.body.userid=res.locals.user._id;
    Tasks.create(req.body, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(data);
        return res.redirect('back');
    })
});

app.get('/deleteTasks', function (req, res) {
    // console.log(req.query.arr);

    const all = req.query.arr.split(",");

    // console.log(all.length);

    if (all[0] !== '') {

        for (i of all) {
            Tasks.findByIdAndDelete(i, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
            })
        }

    }


    return res.redirect('back');
})



app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Server is running at", PORT);
});
