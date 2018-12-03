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
    Get a discussion by id    
*/
discussion_routes.get('/getDiscussion/:id', (req, res) => {
    const id = req.params.id 

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Discussion.findById(id).then((disc) => {
        if (!disc) {
            res.status(404).send()
        } else {
            res.send({ disc })
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
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
    Add a comment to a Discussion Post.
*/
discussion_routes.post('/creatComment/:id',(req, res)=>{
    const id = req.params.id
    log(req.body)
    const com = {
        comment_content: req.body.comment_content,

        user: req.session.user,
        
        comment: null,

        date: req.body.date,

        replies: []
    }
    Discussion.findById(id).then((disc) => {
        if (!disc) {
            res.status(404).send()
        } else {
            disc.comments.push(com)
            res.send(com)
            disc.save(function (err) {
            if (err) {
                return handleError(err)
            }
            });
            res.send(com)
        }
    })  
})

discussion_routes.post('/createReply/:id',(req, res)=>{
    const id = req.params.id;
    const cid = req.body.comment;
    log(req.body)
    const com = {
        comment_content: req.body.comment_content,

        user: req.session.user,
        
        comment: cid,

        date: req.body.date,

        replies: []
    }
    Discussion.findById(id).then((disc) => {
        if (!disc) {
            res.status(404).send()
        } else {
            var doc = disc.comments.id(cid);
            if (!doc) {
                res.status(404).send()
            } else {
                doc.replies.push(com);
                disc.save(function (err) {
                    if (err) {
                        return handleError(err)
                    }
                });
                res.send(com)
            }
        }
    })
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
            res.send("discussion deleted")
        }
    });
})

/*
    Deletes given comment/reply from the database
*/

discussion_routes.delete('/deleteComment/:id/cid', (req, res) => {
    // Add code here
    const id = req.params.id
    const cid = req.params.cid
    const com = {
        comment_content: req.body.comment_content,

        user: req.body.user,
        
        comment: req.body.comment,

        date: req.body.date,

        replies: req.body.replies
    }

    Discussion.findById(id).then((disc) => {
        if (!disc) {
            res.status(404).send()
        }else {
            db.Discussion.find( { _id: cid} ).then((reply) => {
                if (!reply) { 
                    res.status(404).send()
                } else {
                    reply.remove()
                    disc.save(function (err) {
                        if (err) {
                            return handleError(err)                }
                        })   
                }
            })
        }
        
    })
}


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

/*
    Deletes given discussion in the database
    Require movie_id and title
*/
discussion_routes.delete('/deleteDiscussions/:movieId/:title',(req, res) => {
    const movieId = req.params.movieId
    const title = req.params.title
    Discussion.findOneAndDelete({"movie":movieId, "title":title},(err, discussion) =>{
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

module.exports = discussion_routes;