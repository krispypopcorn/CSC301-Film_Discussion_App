"use strict"

/*-------------Add Event-listener-------------*/
$("#profilePic").on('click', function(event) {window.location.href = "../UserProfile/user_profile.html";});
$("#Latest .column").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html";});
$("#MostPopular .column").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html";});
$("#Movie .column").on('click', function(event) {window.location.href = "../MoviePage/movie_page.html";});
$("#homeLink").on('click', function(event) {window.location.href = "homepage.html";});
$("#adminLink").on('click', function(event) {window.location.href = "../AdminDash/admin.html";});
$("#signOut").on('click', function(event) {window.location.href = "../Login/index.html";});
/*-------------Add Event-listener-------------*/

//store current page
let moviePage = 1;
let PopularPage = 1;
let LatestPage = 1;

//keep a copy of the discussion div as template
const discussionDiv = $("#latestSlider .column:first").clone();
const movieDiv = $("#movieSlider .column:first").clone();
let homeMovies = [];


fetch('http://localhost:8000/discussions').then(res => { 
  return res.json()
}).then(data=>{
  //array of movies
  console.log(data)
  homeMovies = data;
  
  //store the total number of discussions and movie
  //we should pull this from server
  let numberOfDiscusstions = 6;
  let numberOfMovies = homeMovies.length;
//array of discussions
//we should pull this from server
const discussions = [];

class User {
   constructor(username, password) {
       this.username = username;
       this.password = password;
   }
}

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

// Dummy user
const DummyUser = new User("author", "123")

const DummyText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

discussions.push(new Discussion("Iron Man is the Coolest Avenger 1", DummyUser, DummyText));
discussions.push(new Discussion("Iron Man is the Coolest Avenger 2", DummyUser, DummyText));
discussions.push(new Discussion("Iron Man is the Coolest Avenger 3", DummyUser, DummyText));
discussions.push(new Discussion("Iron Man is the Coolest Avenger 4", DummyUser, DummyText));
discussions.push(new Discussion("Iron Man is the Coolest Avenger 5", DummyUser, DummyText));
discussions.push(new Discussion("Iron Man is the Coolest Avenger 6", DummyUser, DummyText));

$(".previousButton").on('click',loadPreviousPage);
$(".nextButton").on('click',loadNextPage);

var page1 = homeMovies.slice(0, 4)
changeMovies(page1);


function loadPreviousPage(e) {
   e.preventDefault();
   const targetDiv = $(e.target).parent()
   const id = targetDiv.attr('id')
   let page;
   
   if(id=='MostPopular'){
     if (PopularPage != 1) {
       let index = PopularPage - 1;
       PopularPage--;
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       //need server call
       for (i = index; i < discussions.length && max != 0; i++) {
         targetList.push(discussions[i]);
         max--;}
      changeDiscussions(targetList,id);
     }
   }else if(id=='Latest'){
     if (LatestPage != 1) {
       let index = LatestPage - 1;
       LatestPage--;
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       //need server call
       for (i = index; i < discussions.length && max != 0; i++) {
         targetList.push(discussions[i]);
         max--;}
      changeDiscussions(targetList,id);
     }
   }else{
     if (moviePage!= 1) {
       let index = moviePage - 1;
       moviePage--;
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       //need server call
       for (i = index; i < homeMovies.length && max != 0; i++) {
         targetList.push(homeMovies[i]);
         max--;}
      changeMovies(targetList);
     }
   }
}

function loadNextPage(e) {
   e.preventDefault()
   const targetDiv = $(e.target).parent()
   const id = targetDiv.attr('id');
   
   let total = numberOfDiscusstions;
   if(id=='Movie'){
    total = numberOfMovies;}
   const maxPage = Math.ceil(total / 4);

   if(id=='MostPopular'){
     if (PopularPage != maxPage) {
       let index = PopularPage + 1;
       PopularPage++;
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       //need server call
       for (i = index; i < discussions.length && max != 0; i++) {
         targetList.push(discussions[i]);
         max--;}
      changeDiscussions(targetList,id);
     }
   }else if(id=='Latest'){
     if (LatestPage != maxPage) {
       let index = LatestPage + 1;
       LatestPage++;
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       //need server call
       for (i = index; i < discussions.length && max != 0; i++) {
         targetList.push(discussions[i]);
         max--;}
      changeDiscussions(targetList,id);
     }
   }else{
     if (moviePage!= maxPage) {
       let index = moviePage + 1;
       moviePage++;
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       //need server call
       for (i = index; i <numberOfMovies && max != 0; i++) {
         targetList.push(homeMovies[i]);
         max--;}
      changeMovies(targetList);
     }
   }
}


function createDiscussion(discussion) {
   let newPost = discussionDiv.clone();
   newPost.find(".backGroundImage").attr('src',discussion.image);
   newPost.find(".disTitle").html(discussion.title);
   newPost.find(".author").html(discussion.author.username);
   newPost.on('click',function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html";})
   return newPost;
}

function createMovie(movie) {
   let newPost = movieDiv.clone();
   newPost.find(".backGroundImage").attr('src',movie.poster);
   newPost.find(".movieTitle").html(movie.name);
   newPost.find(".point").html(movie.vote_average.toString());
   newPost.on('click',function(event) {window.location.href = "../MoviePage/movie_page.html";})
   return newPost;
}


function changeDiscussions(DisList,id){
  let i;
   const targetList = [];
   let newPost;
   for (i = 0; i < DisList.length && i < 4; i++) {
       newPost = createDiscussion(DisList[i]);
       targetList.push(newPost);
   }
   if(id=='Latest'){
       $('#latestSlider .column').remove();

      for (i = 0; i < targetList.length; i++) {
          $("#latestSlider").append(targetList[i]);}
   }
   else{
       $('#popularSlider .column').remove();
       for (i = 0; i < targetList.length; i++) {
          $("#popularSlider").append(targetList[i]);}
   }
}

function changeMovies(movieList){
   let i;
   const targetList = [];
   let newPost;
   for (i = 0; i < movieList.length && i < 4; i++) {
       newPost = createMovie(movieList[i]);
       targetList.push(newPost);
   }
    $('#movieSlider .column').remove();

   for (i = 0; i < targetList.length; i++) {
       $("#movieSlider").append(targetList[i]);
   }
  
}


});


