const page_routes = require('express').Router();
const path = require('path')
const log = console.log

const sessionChecker = (req, res, next)=>{
    if(req.session.user) {
        res.redirect('/home')
    }else{
        next()
    }
}
/* 
*get Login page
 */
page_routes.get('/',sessionChecker, (req, res) => {
    res.redirect('/login')
})

page_routes.get('/login', sessionChecker,(req,res) => {
    res.sendFile(path.join(__dirname, '../../App/Login/index.html'))   
});

/* 
*get Home page
 */
page_routes.get('/home', (req, res) => {
    //check if we have active session cookie
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../../App/Homepage/homepage.html')) 
    }else{
        res.redirect('/login')
    }
})

/* 
*get discussion page
 */
page_routes.get('/discussionPage', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../../App/DiscussionPage/discussion_topic_page.html')) 
    }else{
        res.redirect('/login')
    }
})

/* 
*get profile page
 */
page_routes.get('/profilePage', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../../App/UserProfile/user_profile.html'))   
    }else{
        res.redirect('/login')
    }
})

/* 
*get movie page
 */
page_routes.get('/moviePage', (req, res) => {
    if(req.session.user){
        res.sendFile(path.join(__dirname, '../../App/MoviePage/movie_page.html')) 
    }else{
        res.redirect('/login')
    } 
})

/* 
*get admin dash
 */
page_routes.get('/adminDash', (req, res) => {
    res.sendFile(path.join(__dirname, '../../App/AdminDash/admin.html'))   
})

module.exports = page_routes;