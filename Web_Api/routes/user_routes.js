const user_routes = require('express').Router();
const { User } = require('../model/User')
const log = console.log

/*
    Get all available users
*/
user_routes.get('/allUsers', (req, res) => {
    User.find({}).then((result) => {
        log(result)
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
        log(count)
    }).catch((error) => {
        res.status(404).send()
    })
})

module.exports = user_routes
