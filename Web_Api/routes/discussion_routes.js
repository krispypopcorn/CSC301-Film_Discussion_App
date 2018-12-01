const discussion_routes = require('express').Router();
const { Movie } = require('../model/Movie')
const Discussion = require('../model/Discussion')
const log = console.log

/*
    get all discussions in the database
*/

discussion_routes.get('/getAllDiscussions', (req, res) => {
    Discussion.find().then((discussions) => {
        res.send(discussions)
    })
})

discussion_routes.post('/creatDiscussion',(req, res)=>{
    const disc = new Discussion({
        title: req.body.title,
        discussion_content: req.body.discussion_content,
        user: req.session.user,
        movie: req.body.movie,
        img: req.body.img
      })
      disc.save(function (error, user) {
        if (error) {
            res.send(error)
        } else {
          console.log("new discussion posted")
        }
      });
})

module.exports = discussion_routes;