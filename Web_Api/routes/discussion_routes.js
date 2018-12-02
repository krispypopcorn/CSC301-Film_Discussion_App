const discussion_routes = require('express').Router();
const { Discussion } = require('../model/Discussion')
const { User } = require('../model/User')
const fs = require('fs');
const log = console.log

/*
    get all discussions in the database
*/
discussion_routes.get('/getAllDiscussions', (req, res) => {
    Discussion.find().then((discussions) => {
        res.send(discussions)
    }).catch(err => {log(err)})
})

/*
    Get the number of discussion currently in the database
*/
discussion_routes.get('/getDiscussionCount', (req, res) => {
    Discussion.countDocuments({}, (error, num) => {
        res.send({
            "value": num
        })
    })
})

/*
    Get the number of discussion of a given movie
*/
discussion_routes.get('/getMovieDisCount/:id', (req, res) => {
    const id = req.params.id
    Discussion.countDocuments({movie : id}, (error, num) => {
        res.send({
            "value": num
        })
    })
})

/*
   Added new discussion
   return the added discussion
*/
discussion_routes.post('/creatDiscussion',(req, res)=>{
    const disc = new Discussion({
        title: req.body.title,
        discussion_content: req.body.discussion_content,
        user: req.session.user,
        movie: req.body.movie,
        img: req.body.img
      })
      disc.save(function (error, newDis) {
        if (error) {
            res.send(error)
        } else {
            res.send(newDis)
        }
      });
})

/*
    return given movie's discussions 
*/
discussion_routes.get('/getMovieDiscussions/:id', (req, res) => {
    const id = req.params.id
    Discussion.find({movie: id}, function(err, discussions) 
    {
       if (err)
       {
           res.send(err);
       }
       res.send(discussions);
    });
})


/*
    Deletes given discussion in the database
*/
discussion_routes.delete('/deleteDiscussions/:id', (req, res) => {
    const id = req.params.id
    Discussion.findByIdAndRemove(id, (err, discussion) =>{
        if(err){res.send(err)}
        else{
            const img = discussion.img
            fs.unlink('../App/Pictures/'+img, function(err) {
                if (!err){
                    console.log('img deleted');
                }
            });
            res.send("discussion deleted")
        }
    });
})

/*
    return true if current user can edit given discussion
    always true if current user is an admin
*/
discussion_routes.get('/canEdit/:id', (req, res) => {
    const id = req.params.id
    
    User.findById(req.session.user, (err, user) =>{
        if(err){res.send(err)}
        else{
            if(user.admin==true){
                res.send('true')
            }else{
                Discussion.findById(id,(error, discussion)=>{
                    if(!error){
                        const result = discussion.user == req.session.user
                        res.send(result)
                    }
                })
            }
        }
    }); 
})


module.exports = discussion_routes;