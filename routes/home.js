const express = require('express');
const router = express.Router();   

router.get('/', function(req, res){
    res.render('admin-home');
    // if(req.session.userLoggedIn){
    //     if(req.session.user.isAdmin)
    //         res.render('admin-home');
    //     else
    //         res.render('user-home');
    // }  
    // else 
    //     res.redirect('/login');
});

router.get('/login', function(req, res){
    if(req.session.userLoggedIn)
        res.redirect('/');
    else
        res.render('login');
});

router.post('/login', function(req, res){
    console.log(req.body);
});

router.get('/signup', function(req, res){
    res.render('signup');
});

router.post('/signup', function(req, res){
    console.log(req.body);
});

router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;  