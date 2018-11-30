"use strict"

/*-------------Add Event-listener-------------*/
$("#profilePic").on('click', function(event) {window.location.href = "../UserProfile/user_profile.html";});
$("#Latest .column").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html";});
$("#MostPopular .column").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html";});
$("#Movie .column").on('click', function(event) {window.location.href = "../MoviePage/movie_page.html";});
$("#homeLink").on('click', function(event) {window.location.href = "homepage.html";});
$("#adminLink").on('click', function(event) {window.location.href = "../AdminDash/admin.html";});
$("#signOut").on('click', function(event) {window.location.href = "../Login/index.html";});
$(".previousButton").on('click',loadPreviousPage);
$(".nextButton").on('click',loadNextPage);
/*-------------Add Event-listener-------------*/

//store current page
let moviePage = 1;
let PopularPage = 1;
let LatestPage = 1;

//keep a copy of the discussion div as template
const discussionDiv = $("#latestSlider .column:first").clone();
const movieDiv = $("#movieSlider .column:first").clone();
let homeMovies = [];
let discussions = [];
let numberOfDiscusstions;
let numberOfMovies;

const movieFetch=fetch('/findAllMovies')
const discussionFetch=fetch('/getAllDiscussions')

new Promise((resolve, reject)=>{
  Promise.all([movieFetch,discussionFetch]).
  then(datas=>{
    datas[0].json().then(res=>{
      datas[1].json().then(disarray=>{
        resolve([res, disarray])
      })
    })
  })
  .catch()
}).then(res=>{
  homeMovies = res[0]
  discussions= res[1]

  numberOfDiscusstions = discussions.length
  numberOfMovies = homeMovies.length

  let page1 = homeMovies.slice(0, 4)
  changeMovies(page1);
  page1 = discussions.slice(0, 4)
  changeDiscussions(page1)
  changeDiscussions(page1,'Latest')
  changeSlider()
}).catch((error) => {
  console.log(error)
})

function loadPreviousPage(e) {
   e.preventDefault();
   const targetDiv = $(e.target).parent()
   const id = targetDiv.attr('id')
   let page;
   
   if(id=='MostPopular'){
     if (PopularPage != 1) {
       let temp = discussions.slice();
       temp.sort((a,b)=>{
         return a.likes - b.likes;
        });
       let index = PopularPage - 1;
       PopularPage--;
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       for (i = index; i < temp.length && max != 0; i++) {
         targetList.push(temp[i]);
         max--;}
      changeDiscussions(targetList,id);
     }
   }else if(id=='Latest'){
     if (LatestPage != 1) {
       let index = LatestPage - 1;
       LatestPage--;
       let temp = discussions.slice();
       temp.sort((a,b)=>{
         return a.date - b.date;
        });
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;

       for (i = index; i < temp.length && max != 0; i++) {
         targetList.push(temp[i]);
         max--;}
      changeDiscussions(targetList,id);
     }
   }else{
     if (moviePage!= 1) {
       let index = moviePage - 1;
       moviePage--;
       let temp = homeMovies.slice();
       temp.sort((a,b)=>{
         return a.vote_average - b.vote_average;
        });
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       //need server call
       for (i = index; i < temp.length && max != 0; i++) {
         targetList.push(temp[i]);
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

   console.log(total)
   if(id=='Movie'){
    total = numberOfMovies;}
   const maxPage = Math.ceil(total / 4);

   if(id=='MostPopular'){
     if (PopularPage != maxPage) {
       let index = PopularPage + 1;
       PopularPage++;
       let temp = discussions.slice();
       temp.sort((a,b)=>{
         return a.likes - b.likes;
        });
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       //need server call
       for (i = index; i < temp.length && max != 0; i++) {
         targetList.push(temp[i]);
         max--;}
      changeDiscussions(targetList,id);
     }
   }else if(id=='Latest'){
     if (LatestPage != maxPage) {
       let index = LatestPage + 1;
       LatestPage++;
       let temp = discussions.slice();
       temp.sort((a,b)=>{
         return a.date - b.date;
        });
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       for (i = index; i < temp.length && max != 0; i++) {
         targetList.push(temp[i]);
         max--;}
      changeDiscussions(targetList,id);
     }
   }else{
     if (moviePage!= maxPage) {
       let index = moviePage + 1;
       moviePage++;
       let temp = homeMovies.slice();
       temp.sort((a,b)=>{
         return a.vote_average - b.vote_average;
        });
       index = index * 4 - 4;
       const targetList = [];
       
       let max = 4;
       let i = 0;
       
       //need server call
       for (i = index; i <temp.length && max != 0; i++) {
         targetList.push(temp[i]);
         max--;}
      changeMovies(targetList);
     }
   }
}


function createDiscussion(discussion) {
   let newPost = discussionDiv.clone();
   console.log('../Pictures/'+discussion.img)
   newPost.find(".backGroundImage").attr('src','../Pictures/'+discussion.img);
   newPost.find(".disTitle").html(discussion.title);
   newPost.find(".author").html(discussion.user.username);
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
};

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
};

function changeSlider(){
  const bannerDiv = $('#CarouselPicHolder').children()
  let i;
  let temp = homeMovies.slice();
  temp.sort((a,b)=>{
	  return a.vote_average - b.vote_average;
	});
  for (i = 0;i<3;i++){
    let curDiv = bannerDiv[i]
    curDiv.children[0].src=temp[i].banner
  }

}