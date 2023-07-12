const Userdb = require('../model/model');
const bcrypt = require('bcrypt');

//create user
exports.create = async (req, res) => {
    if(!req.body){
        console.log("No body submitted");
        res.redirect('/');
    }
    else{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new Userdb({
        name: req.body.userName,
        gender: req.body.genderRadio,
        phone: req.body.phone,
        email: req.body.email,
        password: hashedPassword
    })
    console.log(user);
    user.save(user)
        .then(data => {
            console.log("Added user data: " + data)
            res.redirect('/');
        })
        .catch(err => {
            res.status(500).render('error', {
                message: err.message || "Unable to add to database"
            });
        });
    }
};

//find one user by ID
exports.findOne = (id) => {
    return new Promise((resolve, reject) => {
        Userdb.findById(id).lean()
                .then(user => {
                    if (!user) {
                        reject("Unable to find user");                        
                    }
                    else {
                        console.log(user);
                        resolve(user);
                    }
                })
                .catch(err => {
                    reject("Error finding user in Database");                    
                });
    })
    
};

//find and retrieve user(s)
exports.find = (req, res) => {
    // if(req.query.id){
    //     const id = req.query.id;
    //     Userdb.findById(id).lean()
    //         .then(data => {
    //             if(!data){
    //                 res.status(404).render('error',{
    //                     message: err.message || "Unable to find user"
    //                 });
    //             }
    //             else{
    //                 console.log(data);
    //                 res.redirect('/');
    //             }
    //         })
    //         .catch(err =>{
    //             res.status(500).render('error',{
    //                 message: err.message || "Error finding   user in Database"
    //             });
    //         }); 
    // }
    // else{
    Userdb.find({ isAdmin: false }).sort({ name: 1 }).lean()
        .then(user => {
            console.log(user);
            res.render('show-users', {
                style: 'show-users.css',
                title: 'Admin Panel',
                navTitle: 'Admin Panel',
                loggedIn: true,
                users: user
            });
        })
        .catch(err => {
            res.status(400).render('error', {
                message: err.message || "Unable to retrieve data from database"
            });
        });
    // }
};

//update user by user id 
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(500).render('error', {
            message: err.message || "Data to update cannot be empty"
        });
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data) {
                res.status(404).render('error', {
                    message: err.message || "Unable to update user"
                });
            }
            else {
                console.log(data);
                res.send(data);
                //res.redirect('/');
            }
        })
        .catch(err => {
            res.status(500).render('error', {
                message: err.message || "Error updating user in Database"
            });
        });
}

//delete user with specified user id
exports.delete = (req, res) => {
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).render('error', {
                    message: err.message || "Unable to delete user"
                });
            }
            else {
                console.log(data);
                res.redirect('/');
            }
        })
        .catch(err => {
            res.status(500).render('error', {
                message: err.message || "Error deleting user in Database"
            });
        });
};

exports.login = (body) => {
    return new Promise((resolve, reject) => {
        if (!body) {
            reject();
        }
        else {
            let userData = {};
            Userdb.findOne({ email: body.email })
                .then(user => {
                    if (user) {
                        bcrypt.compare(body.password, user.password)
                            .then((status) => {
                                if (status)
                                    resolve(user);
                                else
                                    reject("Password is incorrect!");
                            })
                    }
                    else {
                        reject("No user found!");
                    }
                })
        }
    });
}