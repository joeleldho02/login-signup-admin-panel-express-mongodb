const Userdb = require('../model/model');
const bcrypt = require('bcrypt');

function setSession(req, res, user){
    req.session.userLoggedIn = true;
    req.session.isAdmin = user.isAdmin;
    req.session.loggedUser = user;
    req.session.loginErr = false;
    req.session.loginErrMsg = "";
    res.redirect('/');
}

//login user to home page
exports.userLogin = async function(req, res){
     //-------- CODE TO ADD ADMIN -----------//

            // req.session.userLoggedIn = true;        
            // req.session.isAdmin = true;
            // req.session.loggedUser = userData;     
            // res.redirect('/');
    try{
        const userData = await exports.loginAuthenticate(req.body);
        if(userData){
            delete userData.password;
            setSession(req, res, userData);
        }
    }catch(err){
        console.log("Login Error: " + err);
        req.session.loginErr = true;
        req.session.loginErrMsg = err;
        res.redirect('/')
    }
};

//create new user and user signup after email duplicate check and then add to db
exports.create = async (req, res) => {
    if (!req.body) {
        console.log("No body submitted");
        res.redirect('/');
    }
    else {
        Userdb.findOne({ $and: [{ email: req.body.email }, { isAdmin: false }] })
            .then(user => {
                console.log("User already exsits!");
                if (user !== null) {
                    if (req.session.isAdmin){
                        res.render('add-user', {
                            title: 'Add User',
                            admin: req.session.isAdmin,
                            navTitle: 'Add new user',
                            loggedIn: true,
                            signupErr: "Oops..!! User with entered email ID already exsits.",
                            inputData: req.body
                        });
                    }
                    else{
                        //exports.userSignup(req, res);
                        res.render('add-user', {
                            title:'Signup',
                            signupErr: "Oops..!! User with entered email ID already exsits.",
                            inputData: req.body
                        });
                    }
                }
                else {
                    addUserDetails(req, res);
                }
            }).catch(err => {
                res.status(500).render('error', {
                    message: err.message || "Unable to add user to database"
                });
            });
    }
};

async function addUserDetails(req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new Userdb({
        name: req.body.userName,
        gender: req.body.genderRadio,
        phone: req.body.phone,
        email: req.body.email,
        updatedAt: Date.now(),
        password: hashedPassword
    })
    user.save()
        .then(data => {
            console.log("Added user data: " + data)
            if (req.session.isAdmin)
                res.redirect('/admin/users');
            else{
                setSession(req, res, data);
            }
        })
        .catch(err => {
            res.status(500).render('error', {
                message: err.message || "Unable to add user to database"
            });
        });
}

//find one user by ID from db
exports.findOne = (id) => {
    return new Promise((resolve, reject) => {
        Userdb.findById(id).lean()
            .then(user => {
                if (!user) {
                    reject("Unable to find user");
                }
                else {
                    resolve(user);
                }
            })
            .catch(err => {
                reject("Error finding user in Database");
            });
    })
};

//find and retrieve user(s) to display in table
exports.find = (req, res) => {
    Userdb.find({ isAdmin: false }, { name: 1, gender: 1, phone: 1, email: 1, isAdmin: 1 }).collation({locale: "en"})
        .sort({ name: 1 }).lean()
        .then(user => {
            res.render('show-users', {
                style: 'show-users.css',
                title: 'Admin Panel',
                navTitle: 'Admin Panel',
                loggedIn: true,
                users: user,
                //alertMsg: req.query.status
            });
        })
        .catch(err => {
            res.status(400).render('error', {
                message: err.message || "Unable to retrieve data from database"
            });
        });
    // }
};

//update user by user id in db
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(500).render('error', {
            message: err.message || "Data to update cannot be empty"
        });
    }
    const id = req.body.userID;
    const user = new Userdb({
        name: req.body.userName,
        gender: req.body.genderRadio,
        phone: req.body.phone,
        email: req.body.email,
        _id: id
    })
    Userdb.findByIdAndUpdate(id, user)
        .then(data => {
            if (!data) {
                res.status(404).render('error', {
                    message: err.message || "Unable to update user"
                });
            }
            else {
                //res.send(data);   
                const msg = "User details updated successfully!"
                res.redirect('/admin/users');
            }
        })
        .catch(err => {
            res.status(500).render('error', {
                message: err.message || "Error updating user in Database"
            });
        });
}

//delete user with specified user id in db
exports.delete = (req, res) => {
    if (!req.body) {
        return res.status(500).render('error', {
            message: err.message || "User id to delete cannot be empty"
        });
    }
    const id = req.body.userID;
    console.log("ID for delete: " + id);
    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).render('error', {
                    message: err.message || "Unable to delete user"
                });
            }
            else {
                //console.log("Delete succes: " + data);
                res.redirect('/admin/users');
            }
        })
        .catch(err => {
            res.status(500).render('error', {
                message: err.message || "Error deleting user in Database"
            });
        });
};

//search user by user name/email 
exports.search = (req, res) => {
    if (!req.body) {
        return res.status(500).render('error', {
            message: err.message || "Data to search cannot be empty"
        });
    }
    console.log(req.body);
    const searchValue = req.query.searchuser;
    const regex = new RegExp("^" + searchValue);
    Userdb.find({ $and: [{ name: { $regex: regex, $options: 'i' }}, { isAdmin: false }] })
        .collation({locale: "en"})
        .sort({ name: 1 }).lean()
        .then(data => {
            if (!data) {
                res.status(404).render('error', {
                    message: err.message || "Unable to find user"
                });
            }
            else {
                let empty = false;
                if (data.length === 0)
                    empty = true;
                //console.log(data);
                res.render('show-users', {
                    style: 'show-users.css',
                    title: 'Admin Panel',
                    navTitle: 'Admin Panel',
                    loggedIn: true,
                    users: data,
                    showErr: empty,
                    searchInput: searchValue
                });
            }
        })
        .catch(err => {            
            res.send(err);
        });
}

//login validation user and admin
exports.loginAuthenticate = (body, val = false) => {
    return new Promise((resolve, reject) => {
        if (!body) {
            reject("Please input credentials");
        }
        else {
            Userdb.findOne({ $and: [{ email: body.email }, { isAdmin: val }] })
                .then(user => {
                    //console.log(user);
                    if (user !== null) {
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
};

//logout
exports.logout = function(req, res){
    req.session.destroy();
    res.redirect('/');
}