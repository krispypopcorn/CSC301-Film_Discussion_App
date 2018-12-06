const user_routes = require('express').Router();
const { User } = require('../model/User')
const log = console.log
var bcrypt = require('bcrypt');

const sessionExist = (req, res, next)=>{
    if(!req.session.user) {
        res.redirect('/loginPage')
    }else{
        next()
    }
}

/*
    Get all available users
*/
user_routes.get('/allUsers', (req, res) => {
    User.find({}).then((result) => {
        // log(result)
        res.send(result)
    }).catch((error) => {
        res.status(404).send()
    })
})

/*
    Get current user
*/
user_routes.get('/user', (req, res) => {
    User.findById(req.session.user).then((result) => {
        res.send(result)
    }).catch((error) => {
        res.status(404).send()
    })
})

/*
    Get a user by id    
*/
user_routes.get('/getUser/:id', (req, res) => {
    const id = req.params.id;

    User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            res.send(user)
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
})

/*
    Get count on number of users
*/
user_routes.get('/userCount', (req, res) => {
    User.count({}).then((count) => {
        res.send({
            value: count
        })
        // log(count)
    }).catch((error) => {
        res.status(404).send()
    })
})

/*
    Get current user's class
*/
user_routes.get('/userClass', sessionExist, (req, res) => {
    User.findById(req.session.user, (err, user) =>{
        if(err){res.send(err)}
        else{
            res.send(user.admin)
        }
    });
})

user_routes.get('/userIcon', sessionExist, (req, res) => {
    User.findById(req.session.user, (err, user) =>{
        if(err){res.send(err)}
        else{
            res.send(JSON.stringify(user.icon))
        }
    });

})

/*
   return true if given user exists in the database
*/
user_routes.get('/userExist/:name', (req, res) => {
    let name = req.params.name
    User.findOne({"username": name}, (err, user) =>{
        if(err){res.send(err)}
        else{
            if(user!=null){
                res.send('true')
            }
            else{
                res.send('false')
            }
        }
    });
})

user_routes.post('/adminCreateUser', (req, res) => {
    const userData = new User({
        username: req.body.username,
        password: req.body.password,
        admin: false,
        icon: req.body.icon,
        like:0,
      })
    // console.log(userData);
    userData.save().then((result) => {
        res.status(200).send()
    }).catch((error) => {
        log(error)
    })

})

user_routes.post('/createUser',(req, res)=>{
    const userData = new User({
        username: req.body.username,
        password: req.body.password,
        admin: false,
        icon: req.body.icon,
        like:0,
      })
      userData.save(function (error, user) {
        if (error) {
            res.send(error)
        } else {
            req.session.user = user._id;
            res.redirect('/home');
        }
      });
})

user_routes.patch('/modifyUser/:id', (req, res) => {

    let newName = req.body.username
    let newPassword = req.body.password
    let passwordFlag = 0

    if (newPassword) {
        passwordFlag = 1
    }
    log(newName)

    const user_id = req.params.id

    if (passwordFlag === 0) {
        User.findByIdAndUpdate(user_id, {
            username: newName
        }, {new: true}).then((update) => {
            res.send(update)
        }).catch((erorr) => {
            log(error)
        })
    }

    if (passwordFlag === 1) {
        log("reached")
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(newPassword, salt, (error, hash) => {
                let newPass = hash
                User.findByIdAndUpdate(user_id, {
                    username: newName,
                    password: newPass
                }).then((result) => {
                    res.status(200).send()
                }).catch((error) => {
                    log(error)
                })
            })
        })
    }

})


user_routes.patch('/modifyPassword', (req, res)=>{
    let newPassword = req.body.newPassword
    const user_id = req.session.user
    console.log("about to update")

    User.findById(user_id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            user.password = newPassword
            user.save().then((result)=>{
                res.send(result)
            }).catch((error)=>{
                res.status(400).send(error)
            })
        }
    }).catch((error) => {
        res.status(400).send(error)
    })


    User.findById(user_id, {
        password: newPassword
    }, {new: true}).then((update) => {
        res.send(update)
    }).catch((erorr) => {
        log(error)
    })


})

// user_routes.patch('/modifyUserPassword/:id', (req, res) => {

//     const user_id = req.params.id
//     bcrypt.genSalt(10, (error, salt) => {
//         bcrypt.hash(req.body.password, salt, (error, hash) => {
//             // user.password = hash;
//             User.findByIdAndUpdate(user_id, {
//                 password = hash
//             }).then((result) => {
//                 res.status(200).send()
//             }).catch((error) => {
//                 log(error)
//             })
// })

user_routes.get('/searchUser/:id', (req, res) => {
    let user_id = req.params.id
    User.findById(user_id).then((result) => {
        if (result==null){
            res.send('null')
        }else{
        res.send(result)}
    }).catch((error) => {
        log(error)
    })
})

user_routes.get('/searchUserByName/:name', (req, res)=>{
    const name = req.params.name
    User.findOne({username: name}, (err, user) =>{
        if(err){res.send(err)}
        res.send(user)
    })
})


user_routes.patch('/modifyPassword', (req, res)=>{
    let newPassword = req.body.newPassword
    const user_id = req.session.user
    console.log("about to update")

    User.findById(user_id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            user.password = newPassword
            user.save().then((result)=>{
                res.send(result)
            })
        }
        
    }).catch((error) => {
        res.status(400).send(error)
    })


    User.findById(user_id, {
        password: newPassword
    }, {new: true}).then((update) => {
        res.send(update)
    }).catch((erorr) => {
        log(error)
    })


})

user_routes.delete('/deleteFinal/:id', (req, res) => {

    const user_id = req.params.id

    User.findByIdAndRemove(user_id).then((result) => {

        res.status(205).send()
    }).catch((error) => {
        log(error)
        res.status(404).send()
    })
})


user_routes.get('/currentUser', (req, res)=>{
    User.findById(req.session.user).then((result)=>{
        if(!result){
            res.status(404).send()
        }
        else{
            res.send(result)
        }
    })
})

module.exports = user_routes
