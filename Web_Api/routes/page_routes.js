const page_routes = require('express').Router();
const path = require('path')
const { User } = require('../model/User')
const log = console.log

const sessionChecker = (req, res, next)=>{
    if(req.session.user) {
        res.redirect('/adminDash')
    }else{
        next()
    }
}
/* 
*get Login page
 */
page_routes.get('/',sessionChecker, (req, res) => {
    res.redirect('/loginPage')
})

page_routes.get('/loginPage', sessionChecker,(req,res) => {
    res.sendFile(path.join(__dirname, '../App/Login/index.html'))   
});

page_routes.get('/SignUp', sessionChecker,(req,res) => {
    res.sendFile(path.join(__dirname, '../App/SignUp/signup.html'))   
});


/*get Home page
 */
page_routes.get('/home', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../App/Homepage/homepage.html')) 
    }else{
        res.redirect('/loginPage')
    }
})

/* 
*get discussion page
 */
page_routes.get('/discussionPage', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../App/DiscussionPage/discussion_topic_page.html')) 
    }else{
        res.redirect('/loginPage')
    }
})

/* 
*get profile page
 */
page_routes.get('/profilePage', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../App/UserProfile/user_profile.html'))   
    }else{
        res.redirect('/loginPage')
    }
})

/* 
*get movie page
 */
page_routes.get('/moviePage', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../App/MoviePage/movie_page.html')) 
    }else{
        res.redirect('/loginPage')
    } 
})

/* 
*get admin dash
 */
page_routes.get('/adminDash', (req, res) => {
    if(req.session.user){
        User.findById(req.session.user, (err, user) =>{
            if(err){res.send(err)}
            else{
                if(user.admin==true){
                    res.sendFile(path.join(__dirname, '../App/AdminDash/admin.html'))
                }else{
                    res.redirect('/home')
                }
            }
        }); 
    }else{
        res.redirect('/loginPage')
    }   
})

module.exports = page_routes;