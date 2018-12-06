"use strict"

checkUserClass()
setUserIcon()

/*-------------Add Event-listener-------------*/
$("#profilePic").on('click', function(event) {
  eraseCookie('isCurrentUser')
  createCookie('isCurrentUser','true',1)
  window.location.href = "/profilePage";});$("#homeLink").on('click', function(event) {window.location.href = "../Homepage/homepage.html";});
$("#adminLink").on('click', function(event) {window.location.href = "../AdminDash/admin.html";});
$("#signOut").on('click', function(event) {window.location.href = "../Login/index.html";});
$(".card-title").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html";});
$(".previous").on('click',loadPreviousPage);
$(".next").on('click',loadNextPage);
$('#SaveButton').click(tryModifyPassword)

/*-------------Add Event-listener-------------*/

//store current page
let currentPage = 1;

let discussions = null;

const user = getUser()

function getUser(){
  const isCurrentUser = getCookie('isCurrentUser');
  console.log(isCurrentUser);
  if(isCurrentUser == 'true'){
    fetch('/currentUser').then ((result) => {
    return result.json()
  }).then((user) => {
    displayUser(user);
  }).catch((error) => {
    console.log(error)
  })
  }
  else{
    const name = getCookie('User')
    fetch('/searchUserByName/'+name).then ((result) => {
      return result.json()
    }).then((user) => {
      displayOtherUser(user);
      removeModifyPasswordOption()
    }).catch((error) => {
      console.log(error)
    })
  }
}


function removeModifyPasswordOption(){
  const removePasswordBtn = document.querySelector('#ChangePasswordButton')
  removePasswordBtn.parentNode.removeChild(removePasswordBtn);
}



function displayUser(user){
  const username = document.querySelector('#currUsername');
  username.innerText = user.username
  // you have the icon url in the user obj
  $('#userPic').attr('src',user.icon)

  fetch('/currentUserDiscussions').then((result)=>{
    return result.json()
  }).then((discussionList)=>{
    discussions = discussionList
    displayDiscussions(discussionList)
    displayDiscussionNum(discussionList.length)
  }).catch((error)=>{
    console.log(error);
  })
}


function displayOtherUser(user){
  
  const username = document.querySelector('#currUsername');
  username.innerText = user.username
  // you have the icon url in the user obj
  $('#userPic').attr('src',user.icon)

  fetch('/userDiscussions/' + user._id).then((result)=>{
    return result.json()
  }).then((discussionList)=>{
    discussions = discussionList
    
    displayDiscussions(discussionList)
    displayDiscussionNum(discussionList.length)
  }).catch((error)=>{
    console.log(error);
  })
}

function displayDiscussions(discussionList) {

   let i;
   const targetList = [];
   let newPost;
   for (i = 0; i < discussionList.length && i < 4; i++) {
       newPost = createDiscussion(discussionList[i]);
       targetList.push(newPost);
   }

   $('#postsContainer .card').remove();

   for (i = 0; i < targetList.length; i++) {
       $("#postsContainer").append(targetList[i]);
   }
}


function displayDiscussionNum(total){
  const titleWithNum = document.querySelector('#DiscussionTopics')
  titleWithNum.innerText = `My Discussion Topics (${total})`
}


// Helper function
// Creates a discussion div based on given discussion object
function createDiscussion(discussion) {

   // what is this doing?
   let newPost = $(".card:first").clone();
   const target = newPost.children().children();
   
   let img = target.find(".postImg");
   let text = target.find(".card-text");
   let newTitle = target.find(".card-title");
   let upVote = target.find(".upVoteNumber");
   
   // newTitle.on('click',function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html" + "?para1="+ permission;});

    newTitle.on('click',function(event) {
        eraseCookie('discussion')
        createCookie('discussion',discussion._id,1)
        window.location.href = "/discussionPage";});

   img.attr('src',discussion.img);


   text.html(discussion.discussion_content);
   newTitle.html(discussion.title);
   
   
   upVote.html(discussion.likes.toString());

   return newPost;
}

function loadPreviousPage(e) {
   e.preventDefault();
   if (currentPage != 1) {

       let index = currentPage - 1;
       currentPage--;
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;

       for (i = index; i < discussions.length && max != 0; i++) {
           targetList.push(discussions[i]);
           max--;
       }
       displayDiscussions(targetList);
   }
}

function loadNextPage(e) {
   e.preventDefault();
   let total = discussions.length;
   let mainList = discussions;
   const maxPage = Math.ceil(total / 4);


   if (currentPage != maxPage) {
       let index = currentPage + 1;
       currentPage++;
       index = index * 4 - 4;
       const targetList = [];

       let max = 4;
       let i = 0;

       for (i = index; i < mainList.length && max != 0; i++) {
           targetList.push(mainList[i]);
           max--;
       }
       displayDiscussions(targetList);
   }
}


function tryModifyPassword(e){
  e.preventDefault()

  // extract values from fields
  const username = $('#username').val()
  const currPassword = $('#currentPassword').val()
  const newPassword = $('#newPassword').val()
  const confirmNewPassword = $('#confirmNewPassword').val()

  console.log(username)
  // verify that old password is correct

  const loginUrl = '/users/login'

  const headers = {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        }

  const credentials = 'include'

  var params = {
        "username": username,
        "password": currPassword
    };

    fetch(loginUrl, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: headers,
        credentials: credentials,
    }).then(res=>{
        if (res.status === 200) {
            console.log("valid, almost ready to change password");
            if(newPassword === confirmNewPassword){ 
              const modifyPasswordUrl = '/modifyPassword/'
              fetch(modifyPasswordUrl, {
                method: 'PATCH',
                body: JSON.stringify({"newPassword": newPassword}),
                headers : headers,
                credentials : credentials
              }).then(res =>{
                if(res.status === 200){
                  console.log("modified password");
                }
              })
            }
            else{
              console.log("passwords dont match");
            }

        } else {
            console.log("invalid username or password");
        }             
    }).catch((error) => {
    res.status(400).send(error)
  })
}