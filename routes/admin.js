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

router.get('/add-user', function(req, res){
    res.render('add-user', {
        title:'Add User', 
        admin: true, 
        //style: 'add-user-style.css',   
        navTitle: 'Add new user',
        loggedIn: true
    });
});



router.get('/edit-user/:id', async function(req, res){
    console.log('Body: '+ req.body);
    console.log('Params: '+ req.params.id);
    if(req.params.id){
        try{
            const userData = await controller.findOne(req.params.id);
            console.log("Updating user: " + userData);
            res.render('add-user', {
                title:'Edit User', 
                admin: true, 
                //style: 'add-user-style.css',    
                navTitle: 'Edit user',
                loggedIn: true,
                user: userData
            });
        }catch(err){
            console.log("Find User Error: " + err);
        }
    }
    // const userData = {
    //     name: "Rahul Bhaiyaa",
    //     phone: "9123456780",
    //     email: "rahul@yahoo.com",
    //     gender: "Male",
    //     id: req.params.id
    // };

    
}); 

router.get('/users', function(req, res){
    if(req.session.userLoggedIn && req.session.isAdmin)
        controller.find(req, res);
    else
        res.redirect('/');
});
//router.get('/users',controller.find);
router.post('/users',controller.create);
router.put('/users/:id',controller.update);
router.delete('/users/:id',controller.delete);

module.exports = router;  