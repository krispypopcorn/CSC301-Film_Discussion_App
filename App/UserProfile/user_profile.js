"use strict"

// number of total discussions under a movie
// we should pull this from server
let numberOfDiscusstions = 6;

//array of discussions posted by user
//we should pull this from server
const discussions = [];

//store search result
let search = [];

//indicate which section we are in right now
//0 for discussion, 1 for comments, 2 for replies
let view = 0;

//1 if in search mode, 0 otherwise
let searchMode = 0;

//store current page
let currentPage = 1;

checkUserClass()
setUserIcon()

class Discussion {
   constructor(title, author, content) {
       //read from user input or pull from server
       this.title = title;
       this.author = author;
       this.content = content;
       this.thumbsUp = 130;
 
       //user can upload pic, hard code source link for now
       this.image = '../Pictures/iron_man.jpg'
   }
}

class User {
   constructor(username, password) {
       this.username = username;
       this.password = password;
   }
}

// Dummy user
const DummyUser = new User("Dummy", "123")

const DummyText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

discussions.push(new Discussion("Discussion Topic", DummyUser, DummyText));
discussions.push(new Discussion("Discussion Topic", DummyUser, DummyText));
discussions.push(new Discussion("Discussion Topic", DummyUser, DummyText));
discussions.push(new Discussion("Discussion Topic", DummyUser, DummyText));
discussions.push(new Discussion("Discussion Topic", DummyUser, DummyText));
discussions.push(new Discussion("Discussion Topic", DummyUser, DummyText));


/*-------------Add Event-listener-------------*/
$("#profilePic").on('click', function(event) {window.location.href = "../UserProfile/user_profile.html";});
$("#homeLink").on('click', function(event) {window.location.href = "../Homepage/homepage.html";});
$("#adminLink").on('click', function(event) {window.location.href = "../AdminDash/admin.html";});
$("#signOut").on('click', function(event) {window.location.href = "../Login/index.html";});
$(".card-title").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html";});
$(".previous").on('click',loadPreviousPage);
$(".next").on('click',loadNextPage);
$('#DiscussionTopics').click(display_discussion_topics)
$('#Comments').click(display_comments)

/*-------------Add Event-listener-------------*/



const user = getUser()

const html_categories = $('#Categories').children()

var categories = {"discussion_topics":0, "comments":1}

display_category(categories.discussion_topics)


function displayUser(user){
  const username = document.querySelector('#currUsername');
  username.innerText = user.username
  // you have the icon url in the user obj
  $('#userPic').attr('src',user.icon)

  fetch('/currentUserDiscussions').then((result)=>{
    return result.json()
  }).then((discussions)=>{
    console.log(discussions);
  }).catch((error)=>{
    console.log(error);
  })
}

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
      displayUser(user);
    }).catch((error) => {
      console.log(error)
    })
  }
}


function display_discussion_topics(e){
	e.preventDefault();
	display_category(categories.discussion_topics)
}

function display_comments(e){
	e.preventDefault();
	display_category(categories.comments)
}


// Helper function
// Creates a discussion div based on given discussion object
function createDiscussion(discussion) {

   let newPost = $(".card:first").clone();
   const target = newPost.children().children();
   
   let img = target.find(".postImg");
   let text = target.find(".card-text");
   let newTitle = target.find(".card-title");
   let upVote = target.find(".upVoteNumber");
   
   newTitle.on('click',function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html" + "?para1="+ permission;});

   img.attr('src',discussion.image);
   text.html(discussion.content);
   if(view==0){newTitle.html(discussion.title);}
   else if (view==1){newTitle.html("Comment");}
   
   
   upVote.html(discussion.thumbsUp.toString());

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
       addMultiplyDiscussion(targetList);
   }
}

function loadNextPage(e) {
   e.preventDefault();
   let total = numberOfDiscusstions;
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

       addMultiplyDiscussion(targetList);
   }
}

/*-------------------------------------------------------*/
/*Dom function below*/
/*-------------------------------------------------------*/

function addMultiplyDiscussion(discussionList) {
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

function display_category(index){
	if(0 <= index && index <= html_categories.length - 1){
		html_categories[index].style.color = '#3366cc';
		for(let i = 0; i < html_categories.length; i++){
			if(i!== index){
				html_categories[i].style.color = 'white';
			}
		}
	}

	// we should use a server call here to get current user
	//current user holds different lists
	//ex: discussion list, comments list
	//useing hardcode list here for demo
	if(index == 0){
	  currentPage=1;
	  view=0;
		addMultiplyDiscussion(discussions)
	}
	else if (index == 1){
	  currentPage=1;
	  view=1;
		addMultiplyDiscussion(discussions)
	}
	else if(index == 2){
	  currentPage=1;
	  view=2;
		addMultiplyDiscussion(discussions)
	}
}


$('#SaveButton').click(tryModifyPassword)

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
