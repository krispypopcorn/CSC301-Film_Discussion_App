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
 $(".delete").hide();
}
/*----permission check----*/

// number of total discussions under a movie
// we should pull this from server
let numberOfDiscusstions = 4;

//array of discussions posted by user
//we should pull this from server
const discussions = [];

//store search result
let search = [];

//1 if in search mode, 0 otherwise
let searchMode = 0;

//store current page
let currentPage = 1;

//keep a copy of the discussion div as template
const template = $(".card:first").clone();


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

discussions.push(new Discussion("Iron Man is the Coolest Avenger 1", DummyUser, DummyText));
discussions.push(new Discussion("Iron Man is the Coolest Avenger 2", DummyUser, DummyText));
discussions.push(new Discussion("Iron Man is the Coolest Avenger 3", DummyUser, DummyText));
discussions.push(new Discussion("Iron Man is the Coolest Avenger 4", DummyUser, DummyText));


/*-------------Add Event-listener-------------*/
$("#newPost").click(function() {
   $("#popup1").toggle(200);
});
$("#subButton").click(addNewDiscussion);
$("#discussionSearch").click(displaySearch);
$("#searchTerm").keyup(function(event) {
   if (event.keyCode === 13) {
       $("#discussionSearch").click();
   }
});
$("#cleanSearch").click(restoreDiscussion);
$(".previous").on('click',loadPreviousPage);
$(".next").on('click',loadNextPage);
$("#homeLink").on('click', function(event) {window.location.href = "../Homepage/homepage.html" + "?para1="+ permission;});
$("#adminLink").on('click', function(event) {window.location.href = "../AdminDash/admin.html" + "?para1="+ permission;});
$(".card-title").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html" + "?para1="+ permission;});
$(".delete").on('click', deletePost);
/*-------------Add Event-listener-------------*/

function addNewDiscussion(e) {
   e.preventDefault();
   const inputTitle = $('#inputTitle').val();
   const inputText = $('#content').val();

   const newDiscussion = new Discussion(inputTitle, DummyUser, inputText);
   newDiscussion.image = "../Pictures/new_discussion.jpg";
   newDiscussion.thumbsUp=0;
   discussions.unshift(newDiscussion);
   numberOfDiscusstions++;
   updateTopicNum();
   addDiscussionToDom(newDiscussion);
   $("#popup1").toggle(200);
}

function deletePost(e) {
  e.preventDefault();
  const targetDiv = e.target.parentNode.parentNode.parentNode;
  const container = $("#postsContainer").children()
  const targetTitle = targetDiv.children[0].children[1].children[0].children[0].innerHTML
  
  // discussions list should be pulled from server
  let index=0;
  while(discussions[index].title != targetTitle){index++;}
  discussions.splice(index,1);
  numberOfDiscusstions--;
  updateTopicNum();
  currentPage++;
  loadPreviousPage();
}


function displaySearch(e) {
   e.preventDefault()
   search = [];
   currentPage = 1;
   searchMode = 1;
   const inputTitle = $("#searchTerm").val();

   let i;
   //we should pull the discussions list from server
   for (i = 0; i < discussions.length; i++) {
       let cur = discussions[i];
       if (cur.title.includes(inputTitle)) {
           search.push(cur);
       }
   }
   addMultiplyDiscussion(search);
}

// Helper function
// Creates a discussion div based on given discussion object
function createDiscussion(discussion) {

   let newPost = template.clone();
   const target = newPost.children().children();

   let img = target[0].children[0];
   let text = target[1].children[0].children[1];
   let newTitle = target[1].children[0].children[0];
   let upVote = target[2].children[2];
   
   target[3].addEventListener('click',deletePost);
   newTitle.addEventListener('click',function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html" + "?para1="+ permission;});

   img.src = discussion.image;
   text.innerHTML = discussion.content;
   newTitle.innerHTML = discussion.title;
   upVote.innerHTML = discussion.thumbsUp.toString();

   return newPost;
}

function loadPreviousPage() {
   if (currentPage != 1) {

       let index = currentPage - 1;
       currentPage--;
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       //if we are in searchMode
       let mainList = discussions;
       if (searchMode == 1) {
           mainList = search;
       }

       for (i = index; i < mainList.length && max != 0; i++) {
           targetList.push(mainList[i]);
           max--;
       }

       addMultiplyDiscussion(targetList);
   }
}

function loadNextPage() {
   let total = numberOfDiscusstions;
   let mainList = discussions;
   
   //if we are in searchMode
   if (searchMode == 1) {
       total = search.length;
       mainList = search;
   }


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

function addDiscussionToDom(discussion) {
  if($("#postsContainer").children().length==4){$('.card').last().remove();}
  const newPost = createDiscussion(discussion);
  $("#postsContainer").prepend(newPost);
}

function addMultiplyDiscussion(discussionList) {
   let i;
   const targetList = [];
   let newPost;
   for (i = 0; i < discussionList.length && i < 4; i++) {
       newPost = createDiscussion(discussionList[i]);
       targetList.push(newPost);
   }

   $('#postsContainer .card').remove();

   for (i = 0; i < discussionList.length; i++) {
       $("#postsContainer").append(targetList[i]);
   }
}

function restoreDiscussion(e) {
   search = [];
   currentPage = 1;
   searchMode = 0;
   let i = 0;
   let newPost;
   const targetList = [];
   for (i = 0; i < discussions.length && i < 4; i++) {
       newPost = createDiscussion(discussions[i]);
       targetList.push(newPost);
   }
   $('#postsContainer .card').remove();

   for (i = 0; i < targetList.length; i++) {
       $("#postsContainer").append(targetList[i]);
   }
}

function updateTopicNum() {
   $("#discussionTopic")[0].innerHTML = numberOfDiscusstions;
}
