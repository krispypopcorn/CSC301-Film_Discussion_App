const user_routes = require('express').Router();
const { User } = require('../model/User')
const log = console.log

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
user_routes.get('/userClass', (req, res) => {
    User.findById(req.session.user, (err, user) =>{
        if(err){res.send(err)}
        else{
            res.send(user.admin)
        }
    });
})

user_routes.get('/userIcon', (req, res) => {
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
          req.session.userId = user._id;
          return res.redirect('/home');
        }
      });
})

user_routes.patch('/modifyUserName/:id', (req, res) => {

    let newName = req.body.username
    log(newName)
    const user_id = req.params.id
    User.findByIdAndUpdate(user_id, {
        username: newName
    }, {new: true}).then((update) => {
        res.send(update)
    }).catch((erorr) => {
        log(error)
    })

})

user_routes.get('/searchUser/:id', (req, res) => {

    let user_id = req.params.id

    User.findById(user_id).then((result) => {

        if (!result) {
            res.status(404).send()
        } else {
            res.send(result)
        }
    }).catch((error) => {
        log(error)
    })


})

user_routes.delete('/deleteFinal/:id', (req, res) => {
    log("reached")

    const user_id = req.params.id

    User.findByIdAndRemove(user_id).then((result) => {

        res.status(205).send()
    }).catch((error) => {
        log(error)
        res.status(404).send()
    })
})

module.exports = user_routes
