const express = require('express');
const router = express.Router(); 
const services = require('../server/services/render');
const controller = require('../server/controller/controller');

router.get('/', function(req, res){
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

router.get('/signup', function(req, res){
    if(req.session.userLoggedIn)
        res.redirect('/');
    else{
        res.render('add-user', {
            title:'Signup',
        });
    }
});

router.post('/login', controller.userLogin);

router.get('/logout', controller.logout);

module.exports = router;  