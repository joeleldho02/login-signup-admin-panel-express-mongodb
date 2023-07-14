const express = require('express');
const router = express.Router(); 
const services = require('../server/services/render');
const controller = require('../server/controller/controller');

router.get('/', function(req, res){
    if(req.session.userLoggedIn && req.session.isAdmin)
        res.render('admin-home',{
            style: 'admin-home.css', 
            title:'Welcome', 
            navTitle: 'Admin Panel',
            loggedIn: true,
            user: req.session.loggedUser
        });
    else
        res.redirect('/login');       
});

router.get('/login', function(req, res){
    if(req.session.userLoggedIn)
        res.redirect('/');
    else
        res.render('login',{
            title:'Admin Login',
            adminLogin: true,
            errMsg: req.session.adminLoginErrMsg, 
            err: req.session.adminLoginErr
        });
});

router.post('/login', async function(req, res){
    console.log(req.body);
    //-------- CODE TO ADD ADMIN -----------//
     
            // req.session.userLoggedIn = true;           
            // req.session.isAdmin = true;
            // req.session.loggedUser = userData;     
            // res.redirect('/');
    try{
        const userData = await controller.loginAuthenticate(req.body, true);
        console.log("Login Success: " + userData);
        if(userData){
            req.session.userLoggedIn = true;
            req.session.isAdmin = userData.isAdmin;
            req.session.loggedUser = userData;
            req.session.adminLoginErr = false;
            req.session.adminLoginErrMsg = "";
            res.redirect('/');
        }
    }catch(err){
        console.log("Login Error: " + err);
        req.session.adminLoginErr = true;
        req.session.adminLoginErrMsg = err;
        res.redirect('/admin/login')
    }
});

router.get('/add-user', function(req, res){
    if(req.session.userLoggedIn && req.session.isAdmin)
    res.render('add-user', {
        title:'Add User', 
        admin: req.session.isAdmin,  
        navTitle: 'Add new user',
        loggedIn: true
    });
    else
        res.redirect('/');    
});

router.get('/find-user', function(req, res){
    if(req.session.userLoggedIn && req.session.isAdmin)
        res.render('find-user', {
            style: 'find-user.css',
            title: 'Admin Panel',
            navTitle: 'Admin Panel',
            loggedIn: true,
            // users: user    
        });
    else
        res.redirect('/');    
});

router.get('/edit-user/:id', async function(req, res){
    if(req.session.userLoggedIn && req.session.isAdmin){
        if(req.params.id){
            try{
                const userData = await controller.findOne(req.params.id);
                res.render('add-user', {
                    title:'Edit User', 
                    admin: req.session.isAdmin,       
                    navTitle: 'Edit user',
                    loggedIn: true,
                    user: userData,
                    userId: req.params.id
                });
            }catch(err){
                console.log("Find User Error: " + err);
            }
        } 
        else
            res.redirect('back',{alertMsg:"Updated"});  
    }    
    else
        res.redirect('/'); 
}); 

router.get('/users', function(req, res){
    if(req.session.userLoggedIn && req.session.isAdmin){
        if(req.query.searchuser){
            controller.search(req, res);            
        }
        else{
            controller.find(req, res);
        }
    }
    else
        res.redirect('/');
});
router.post('/adduser', controller.create);
router.post('/edituser', controller.update);
router.post('/deleteuser', controller.delete);
//router.post('/users', controller.search);  
//router.get('/users', controller.search); 

module.exports = router;  