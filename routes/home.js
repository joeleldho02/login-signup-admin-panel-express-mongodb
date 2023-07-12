const express = require('express');
const router = express.Router(); 
const services = require('../server/services/render');
const controller = require('../server/controller/controller');

// const userData = {
//     name: "Rahul Bhaiyaa",
//     phone: "9123456780",
//     email: "rahul@yahoo.com"
// };

router.get('/', function(req, res){
    //res.render('admin-home');
    if(req.session.userLoggedIn){
        if(req.session.isAdmin)
            res.redirect('/admin');        
        else
            res.redirect('/user');        
    }    
    else 
        res.redirect('/login');
});

router.get('/user', function(req, res){
    if(req.session.userLoggedIn && !req.session.isAdmin)
        res.render('user-home',{
            style: 'user-home.css', 
            title:'Welcome', 
            navTitle: 'Welcome ' + req.session.loggedUser.name,
            loggedIn: true,
            user: req.session.loggedUser
        });
    else
        res.redirect('/');
});

router.get('/login', function(req, res){
    if(req.session.userLoggedIn)
        res.redirect('/');
    else
        res.render('login',{
            title:'Login',
            errMsg: req.session.loginErrMsg, 
            err: req.session.loginErr});
});

router.post('/login', async function(req, res){
    console.log(req.body);
            // req.session.userLoggedIn = true;
            // req.session.isAdmin = true;
            // req.session.loggedUser = userData;
            // res.redirect('/');
    try{
        const userData = await controller.login(req.body);
        console.log("Login Success: " + userData);
        if(userData){
            req.session.userLoggedIn = true;
            req.session.isAdmin = userData.isAdmin;
            req.session.loggedUser = userData;
            req.session.loginErr = false;
            req.session.loginErrMsg = "";
            res.redirect('/');
        }
    }catch(err){
        console.log("Login Error: " + err);
        req.session.loginErr = true;
        req.session.loginErrMsg = err;
        res.redirect('/')
    }
});

router.get('/signup', function(req, res){
    res.render('add-user', {
        title:'Signup',
        //style: 'signup-style.css'
    });
});

router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

router.post('/users',controller.create);
router.get('/users',controller.find);
router.put('/users/:id',controller.update);
router.delete('/users/:id',controller.delete);


module.exports = router;  