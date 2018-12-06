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
    const cid = req.params.cid;

    Comment.findById(cid).then((com) => {
        if (!com) {
            res.status(404).send()
        } else {
            res.send(com)
        }    
    })
})

/*
    get all comments in the database
*/
discussion_routes.get('/getAllComments', (req, res) => {
    Comment.find().then((comments) => {
        res.send(comments)
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
    Send the replies of a given comment
*/
discussion_routes.get('/getReplies/:cid', (req, res) => {

    const cid = req.params.cid

    Comment.findById(cid, (err, comment) =>{
        if(err){
            res.send(err)
        }else{
            res.send(comment.replies)
        }
    });
    
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
discussion_routes.post('/createComment/:id',(req, res)=>{
    const id = req.params.id
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
            disc.comments.push(com._id)
            disc.save(function (err) {
            if (err) {
                log(err)
                return handleError(err)
            }
            });
            com.save(function (err) {
            if (err) {
                log(err)
                return handleError(err)
            }
            });
            
            
            res.send(com)
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

    const com = new Comment ({
        comment_content: req.body.comment_content,

        user: req.session.user,
        
        comment: cid,
    })
    Comment.findById(cid).then((parentComment) => {
        if (!parentComment) {
        	
            res.status(404).send()
        } else {
                parentComment.replies.push(com._id)
                parentComment.save(function (err) {
                    if (err) {
                        return handleError(err)
                    }
                });
                com.save(function (err) {
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

   return comments.filter(function(ele){
       return ele != cid;
   });

}

discussion_routes.delete('/deleteComment/:id/', (req, res) => {
    // Add code here
    const id = req.params.id

    Comment.findByIdAndRemove(id, (err, com) =>{
        if(!com){res.send(err)}
        else{
            com.save(function (err) {
                    if (err) {
                        return handleError(err)
                    }
            });
            res.send("Comment Deleted")
        }
    });
    
})

/*
    Deletes given comment from the database
*/

discussion_routes.delete('/deleteComment/:id/:cid', (req, res) => {
    // Add code here
    const id = req.params.id
    const cid = req.params.cid


    Discussion.findById(id, (err, discussion) =>{
        if(err){res.send(err)}
        else{
            discussion.comments = deleteArrayElement(discussion.comments, cid);
            discussion.save(function (err) {
                    if (err) {
                        return handleError(err)
                    }
            });
            Comment.findByIdAndRemove(cid, (err, comment) =>{
                if(err){res.send(err)}
                else{
                    //res.send(comment.replies)
                    res.send("Comment Deleted");
                }
            });
        }
    });
    
})

/*
    Deletes given reply from the database
*/

discussion_routes.delete('/deleteReply/:id/cid', (req, res) => {
    // Add code here
    const id = req.params.id
    const cid = req.params.cid

    Comment.findById(id, (err, com) =>{
        if(err){res.send(err)}
        else{
            com.replies = deleteArrayElement(com.replies, cid);
            com.save(function (err) {
                    if (err) {
                        return handleError(err)
                    }
            });
            Comment.findByIdAndRemove(cid, (err, discussion) =>{
                if(err){res.send(err)}
                else{
                    res.send("comment deleted")
                }
            });
            
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
                res.send(true)
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
discussion_routes.patch('/resetComments/:id', (req, res) => {
    const id = req.params.id;

    Discussion.findById(id,(error, discussion)=>{
                    if(discussion){
                        discussion.comments = []
                        discussion.save(function (err) {
                        if (err) {
                            return handleError(err)
                        }
                        });
                        res.send("Comments Deleted")

                    }
                })
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

discussion_routes.get('/currentUserDiscussions/', (req, res)=>{
    Discussion.find({user : req.session.user}).then(discussions=>{
        res.send(discussions)
    }).catch(error=>{
         res.status(400).send(error)
    })
})

discussion_routes.get('/userDiscussions/:username', (req, res)=>{
    const username = req.params.username
    Discussion.find({user : username}).then(discussions=>{
        res.send(discussions)
    }).catch(error=>{
         res.status(400).send(error)
    })
})

module.exports = discussion_routes;