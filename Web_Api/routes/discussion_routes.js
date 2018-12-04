const discussion_routes = require('express').Router();
const { Discussion } = require('../model/Discussion.js')
const { Comment } = require('../model/Comment.js')
const { User } = require('../model/User')
const fs = require('fs');
const log = console.log
const { ObjectID } = require('mongodb')

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
    const id = req.params.id;

    Discussion.findById(id).then((disc) => {
        if (!disc) {
            res.status(404).send()
        } else {
            res.send(disc)
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
})

/*
    Get a comment by id    
*/
discussion_routes.get('/getComment/:cid', (req, res) => {
    const cid = req.params.id;

    Comment.findById(id).then((com) => {
        if (!com) {
            res.status(404).send()
        } else {
            res.send(com)
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
        img: req.body.img,
        comments: [],
        likes:  0, 
        liked_user: []
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
    const com = new Comment({
        comment_content: req.body.comment_content,

        user: req.session.user,
        
        comment: null,

        replies: []
    })
    Discussion.findById(id).then((disc) => {
        if (!disc) {
            res.status(404).send()
        } else {
            com.save(function (err) {
                    if (err) {
                        return handleError(err)
                    }
            });
            disc.comments.push(com._id)
            res.send(com)
            disc.save(function (err) {
            if (err) {
                log(err)
                return handleError(err)
            }
            });
        }
    })  
})

/* 
    Create a reply to the comment with ID == cid
*/

discussion_routes.post('/createReply/:cid',(req, res)=>{

    const cid = req.params.cid;

    if (!ObjectID.isValid(cid)) {
        return res.status(404).send()
    }

    log(req.body)
    const com = new Comment ({
        comment_content: req.body.comment_content,

        user: req.session.user,
        
        comment: cid,
    })
    Comment.findById(cid).then((parentComment) => {
        if (!parentComment) {
            res.status(404).send()
        } else {
                com.save(function (err) {
                    if (err) {
                        return handleError(err)
                    }
                });
                parentComment.replies.push(com._id)
                parentComment.save(function (err) {
                    if (err) {
                        return handleError(err)
                    }
                });
                res.send()
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
    Deletes given element from the Array
*/

function deleteArrayElement(comments, cid) {
    const index = comments.indexOf(cid);
    comments.splice(index, 1);
}






/*
    Deletes given comment from the database
*/

discussion_routes.delete('/deleteComment/:id/:cid', (req, res) => {
    // Add code here
    const id = req.params.id
    const cid = req.params.cid

    Discussion.findById(id).then((disc) => {
        if (!disc) {
            res.status(404).send()
        } else {
            deleteArrayElement(discussion.comments, cid);
            Comment.findByIdAndRemove(cid, (err, discussion) =>{
                    if(err){res.send(err)}
                    else{
                        res.send("discussion deleted")
                    }
            });
            disc.save(function (err) {
            if (err) {
                log(err)
                return handleError(err)
            }
            });
        }
    })  
    
})

/*
    Deletes given reply from the database
*/

discussion_routes.delete('/deleteReply/:id/:cid', (req, res) => {
    // Add code here
    const id = req.params.id
    const cid = req.params.cid

    Comment.findById(id).then((com1) => {
        if (!com1) {
            res.status(404).send()
        } else {
            deleteArrayElement(com1.replies, cid);
            Comment.findByIdAndRemove(cid, (err, discussion) =>{
                    if(err){res.send(err)}
                    else{
                        res.send("discussion deleted")
                    }
            });
            com1.save(function (err) {
            if (err) {
                log(err)
                return handleError(err)
            }
            });
        }
    })  
    
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
            res.send("discussion deleted")
        }
    });
})

discussion_routes.get('/discussionInMovie/:movieId/:title', (req, res)=> {
    const movieId = req.params.movieId
    const title = req.params.title
    Discussion.findOne({"movie":movieId, "title":title}, (err, discussion) =>{
        if(err){res.send(err)}
        else{
            if(discussion){
                res.send('true')
            }else{
                res.send('false')
            }
        }
    })
})

/*
    increment likes by one if current user haven't voted before
    decrement otherwise
*/
discussion_routes.patch('/LikeDiscussion/:movieId/:title',(req, res) => {
    const movieId = req.params.movieId
    const title = req.params.title
    const user = req.session.user
    Discussion.findOne({"movie":movieId, "title":title}, (err, discussion) =>{
        if(err){res.send(err)}
        else{
            let found = false;
            let i = 0;
            const L = discussion.liked_user.length
           while(i!=L && !found){
                if(discussion.liked_user[i]==user){
                    found = true;
                    discussion.liked_user.splice(i,1);
                    discussion.likes--
                }
                i++
            }
            if(found==false){
                discussion.liked_user.push(user)
                discussion.likes++
            }
            discussion.markModified('liked_user');
            discussion.markModified('liks');
            discussion.save((error, newDis)=>{
                if(!error){
                    res.send(
                        {"value": newDis.likes})
                }
            });
        }
    });
})


/*
    return total num of like of a given movie
*/
discussion_routes.get('/totalLikesMovie/:movieId', (req, res) => {
    const movieId = req.params.movieId
    Discussion.find({movie: movieId}).then((discussions) => {
        let sum = 0
        discussions.forEach(element => {
            sum += element.likes
        });
        res.send({
            value: sum
        })
    })
})

module.exports = discussion_routes;