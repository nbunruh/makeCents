var db = require("../models");
var path = require("path");
var bcrypt = require('bcrypt');
var passport = require("passport");
var passportlocal = require("passport-local");
//inverted version of req.session.passport for rendering of the navbar and displays on the main layout
var loggedin_b = null;
var loggedInAs = null;
var usernameLoggedIn = null;
var sessionId = null;

//var User = require("../models/user");

//console.log("currently in the burger-api-routes file");
module.exports = function(app) {

    app.get("/", function(req, res) {
        // Finding all-added burgers in the db
        loggedin_b = !req.isAuthenticated();
        console.log("+++++++++++++++++++++++++++++++++++++++++++++");
        console.log("authenticated? -> " + req.isAuthenticated());
        console.log("loggedin_b: " + loggedin_b)
        console.log("this is the session number: " + req.session.passport);
        console.log("+++++++++++++++++++++++++++++++++++++++++++++");
        //req.flash('message', 'Hi there! Welcome to the DashBoard. To begin, either Login or Register to be on your and save money!');
        res.render("user", {message: 'Hi there! Welcome to the DashBoard. To begin, either Login or Register to be on your and save money!', loggedin_b: loggedin_b});
        //res.json(userInDb);
    });
    //route to render the login page.
    app.get("/users/login",function(req, res) {
        console.log("jumping jupiters - optimus primus");
        res.render("login", {message: 'Inncorrect Credentials or not registered with Make Cents.'});
    });
    //route for questionaire
    app.get("/users/questions",function(req, res) {
        console.log("jumping jupiters - optimus primus");
        res.render("questions");
    });

    //route to have user added to the db and register
    app.get("/users/register", function(req, res) {
        res.render("register", {reg_flag:true});
    });

    app.get("/users/wallet", function(req, res) {
        res.render("wallet", {message: 'Currently logged in as: ' + usernameLoggedIn});
    });
    //nolan's route
    app.get("/users/graphs", function(req, res) {
        res.render("graphs");
    });

    app.post("/users/register", function(req, res) {
        //grabbing fields from registration form.
        var name = req.body.name;
        var email = req.body.email;
        var username = req.body.username;
        var password1 = req.body.password;
        var password2 = req.body.password_confirm;

        //some validation (using express-validation) for the registration form
        req.checkBody("name", "Name is required").notEmpty();
        req.checkBody("email", "Email is required").notEmpty();
        req.checkBody("email", "Email is not valid").isEmail();
        req.checkBody("username", "Username is required").notEmpty();
        req.checkBody("password", "Password is required").notEmpty();
        req.checkBody("password_confirm", "Passwords do not match!").equals(req.body.password);
        //variable to store errors found from validation package.
        var errors = req.validationErrors();
        //errors that occur when filling out registration form.
        if(errors) {
            res.render("register", {errors: errors});
        }
        else {
            console.log("no errors in registration form.");
            //hashing the password for user's security.
            bcrypt.hash(password1, 10, function(err, hash) {
                if(err) console.log(err);
                //encrypting the user password witih hash.
                password1 = hash;
                //relaing user registration data to MySQL
                db.Users.create({
                    name: req.body.name,
                    email: req.body.email,
                    username: req.body.username,
                    password: password1
                }).then(function (data) {
                    console.log("password after hash: " + data.password);
                    //req.flash("success_msg", "You are now Registered with Make-Cents!");
                    res.render("login", {success: "You have sucessfully registered with Make-Cents. Please login."});
                });
            });
        }
    });

    passport.use(new passportlocal.Strategy(function(username, password, done) {
        //locating the username within our db and storing identifier in usernameLoggedIn global vars.
        usernameLoggedIn = username;
        db.Users.findOne({
            where: {
                username: username
            }
        }).then(function(data){
            //if(err) throw err;
            if(data === null) {
                return done(null, false, { message: "You are not yet registered." });
            }
            //built-in method from bcrypt to compare the candidate password
            //with hashed password currently in the db.
            bcrypt.compare(password, data.password, function(err, isMatch) {
                if(err) throw err;
                console.log(isMatch);
                if(isMatch) {
                    return done(null, data, {message: "You are logged in!" });
                }
                else {
                    return done(null, false, { message: "Invalid credentials." });
                }
            });
        });
    }));
    //returns the user data to serilizer and grabs the id for session storing
    passport.serializeUser(function(user, done) {
        console.log(user.id);
        done(null, user.id);

    });
    //deserializing and grabbing userid as the session key.
    passport.deserializeUser(function(id, done) {
        //query the db to see if user session key exists.
        console.log("id in the deserializeUser method: " + id);
        //storing sessionId of logged in person globally to be referenced later with spendings table.
        sessionId = id;
        //finding matched id of user in the db
        db.Users.findOne({
            where: {
                id: id
            }
        }).then(function(data){
            //if(err) throw err;
            done(null, data);
        });
    });
    //passport authentication flow.
    app.post("/users/login",
        passport.authenticate('local', { successRedirect: '/users/wallet',
            failureRedirect: '/users/login',
            failureFlash: true }));

    //route for logging out the user.
    app.get("/users/logout", function(req, res) {
        res.render("logout");
    });

    // I added these routes..
    // app.get('/api/usergroup',function (req, res) {
    //     db.user.findAll({
    //         where: {
    //             groupName: req.body.groupName
    //         },
    //         include:[
    //             {
    //                 model:db.group,
    //                 include:[
    //                     {
    //                         model:db.spendings
    //                     }
    //                 ]
    //             }
    //         ]
    //     }).then(function (data) {
    //         res.json(data);
    //     })
    // });

    // app.get('/api/user/:id',function (req, res) {
    //     db.user.findAll({
    //         where: {
    //             id: req.params.id
    //         },
    //         include:[
    //             {
    //                 model:db.group,
    //                 include:[
    //                     {
    //                         model:db.spendings
    //                     }
    //                 ]
    //             }
    //         ]
    //     }).then(function (data) {
    //         res.json(data);
    //     })
    // });

    // app.get('/api/Allusers',function (req, res) {
    //     db.user.findAll({
    //         include:[
    //             {
    //                 model:db.group,
    //                 include:[
    //                     {
    //                         model:db.spendings
    //                     }
    //                 ]
    //             }
    //         ]
    //     }).then(function (data) {
    //         res.json(data);
    //     })
    // });

    // app.post('/api/adduser', function(req, res){
    //     const created_at = new Date();
    //     // var date =dateFormat(created_at, "dddd, mmmm dS, yyyy");

    //     const newUser = req.body.user;
    //     db.Users.create({
    //         name: "Hanifa",
    //         email:"youn@gmail.com",
    //         phoneNumber: 2442324,
    //         // createdAt: date,
    //         //updatedAt: date,

    //         // name: newUser.name,
    //         // email: newUser.email,
    //         // phoneNumber: newUser. phoneNumber,
    //     })
    //         .then(function(user) {
    //             res.json(user);
    //         });
    // });

    app.post('/api/addgroup', function(req, res){
        //const created_at = new Date();
        // const newGroup = req.body.post;
        db.Groups.create({
            UserId: '1',
            groupName: "gooing HOme",
            groupImage:"com",
            groupTheme:"Work Harder",
            // UserId: newGroup.UserId,
            // groupName: newGroup.groupman,
            // groupImage: newGroup.groupImage,
            // groupTheme: newGroup.groupTheme,
        })
            .then(function(groupData) {
                res.json(groupData);
            });
    });

    app.post('/users/walletCreate', function(req, res){
        // const created_at = new Date();
        console.log(req);
        var total;
        const newSpending = req.body.comment;
        db.Spendings.create({
            userId: sessionId,
            groceries: req.body.groceries,
            gas: req.body.gas,
            leisure: req.body.leisure,
            totalSpendings: req.body.totalSpendings
        }).then(function(spending){
            res.json(spending);
        });
    });
};//end of module.

