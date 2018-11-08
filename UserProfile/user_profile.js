"use strict"

/*-------------permission check-------------*/
/*----get permission from previous page----*/
/*------should be done through server-----*/
let permission = "none";

let queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
queryString = queryString.split("?")[0];

const index = queryString.indexOf("=");
if(index!=-1){permission = queryString.substring(index+1);}

if(permission=="none"){
   window.location.href = "../Login/index.html";
} else if(permission=="user"){
  $("#adminLink").hide();
}
/*----permission check----*/

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
$("#profilePic").on('click', function(event) {window.location.href = "../UserProfile/user_profile.html" + "?para1="+ permission;});
$("#homeLink").on('click', function(event) {window.location.href = "../Homepage/homepage.html" + "?para1="+ permission;});
$("#adminLink").on('click', function(event) {window.location.href = "../AdminDash/admin.html" + "?para1="+ permission;});
$("#signOut").on('click', function(event) {window.location.href = "../Login/index.html";});
$(".card-title").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html" + "?para1="+ permission;});
$(".previous").on('click',loadPreviousPage);
$(".next").on('click',loadNextPage);
$('#DiscussionTopics').click(display_discussion_topics)
$('#Comments').click(display_comments)
$('#Replies').click(display_replies)

/*-------------Add Event-listener-------------*/

const html_categories = $('#Categories').children()

var categories = {"discussion_topics":0, "comments":1, "replies":2}

display_category(categories.discussion_topics)


function display_discussion_topics(e){
	e.preventDefault();
	display_category(categories.discussion_topics)
}

function display_comments(e){
	e.preventDefault();
	display_category(categories.comments)
}

function display_replies(e){
	e.preventDefault();
	display_category(categories.replies)
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
   else(newTitle.html("Reply"))
   
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

