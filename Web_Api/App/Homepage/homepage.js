"use strict"

/*-------------Add Event-listener-------------*/
$("#profilePic").on('click', function(event) {
  eraseCookie('isCurrentUser')
  createCookie('isCurrentUser','true',1)
  window.location.href = "/profilePage";});
$("#homeLink").on('click', function(event) {window.location.href = "/home";});
$("#adminLink").on('click', function(event) {window.location.href = "/adminDash";});
$("#signOut").on('click', function(event) {window.location.href = "/logout";});
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

const disUrl = '/getAllDiscussions';
const Movieurl = '/findAllMovies';

getDiscussion();
getMovie();
checkUserClass()
setUserIcon()

function getMovie(){
  fetch(Movieurl)
  .then((res) => { 
      if (res.status === 200) {
         return res.json() 
     } else {
          alert('Could not get movies')
     }                
  })
  .then((json) => {
    homeMovies=json;
    numberOfMovies=homeMovies.length;
    let temp = homeMovies.slice();
    temp.sort((a,b)=>{
      return b.vote_average - a.vote_average;
    });
    movieHelper(1, temp)
    changeSlider()
  }).catch((error) => {
      console.log(error)
  })
}

function getDiscussion(){
  fetch(disUrl)
  .then((res) => { 
      if (res.status === 200) {
         return res.json() 
     } else {
          alert('Could not get discussion')
     }                
  })
  .then((json) => {
    discussions=json;
    numberOfDiscusstions=discussions.length;
    let temp = discussions.slice();
    temp.sort((a,b)=>{
      return b.likes - a.likes;
    });
    discussionHelper(1, temp, "MostPopular")
    temp.sort((a,b)=>{
      return -(new Date(a.date) - new Date(b.date));
    });
    discussionHelper(1, temp, "Latest")
  }).catch((error) => {
      console.log(error)
  })
}

function getUser(id){
  return fetch("/searchUser/"+id, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
  .then((res) => { 
    if (res.status === 200) {
      return res.json()
   }else {
      return null
   }                
}).catch((error) => {
  })
}

function loadPreviousPage(e) {
  e.preventDefault();
  const targetDiv = $(e.target).parent()
  const id = targetDiv.attr('id')
   
  if(id=='MostPopular'){
    if (PopularPage != 1) {
      let temp = discussions.slice();
      temp.sort((a,b)=>{
        return b.likes - a.likes;
       });
      let index = PopularPage - 1;
      PopularPage--;
      discussionHelper(index, temp, id)
    }
  }else if(id=='Latest'){
    if (LatestPage != 1) {
      let index = LatestPage - 1;
      LatestPage--;
      let temp = discussions.slice();
      temp.sort((a,b)=>{
        return -(new Date(a.date) - new Date(b.date));
       });
       discussionHelper(index, temp, id)
    }
  }else{
    if (moviePage!= 1) {
      let index = moviePage - 1;
      moviePage--;
      let temp = homeMovies.slice();
      temp.sort((a,b)=>{
        return b.vote_average - a.vote_average;
       });
       movieHelper(index, temp)
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
       let temp = discussions.slice();
       temp.sort((a,b)=>{
         return b.likes - a.likes;
        });
        discussionHelper(index, temp, id)
     }
   }else if(id=='Latest'){
     if (LatestPage != maxPage) {
       let index = LatestPage + 1;
       LatestPage++;
       let temp = discussions.slice();
       temp.sort((a,b)=>{
         return -(new Date(a.date) - new Date(b.date));
        });
        discussionHelper(index, temp, id)
     }
   }else{
     if (moviePage!= maxPage) {
       let index = moviePage + 1;
       moviePage++;
       let temp = homeMovies.slice();
       temp.sort((a,b)=>{
         return -(a.vote_average - b.vote_average);
        });
        movieHelper(index, temp)
     }
   }
}


function discussionHelper(index, temp, id){
  index = index * 4 - 4;
  const targetList = [];
  
  let max = 4;
  let i = 0;
  
  for (i = index; i < temp.length && max != 0; i++) {
    targetList.unshift(temp[i]);
    max--;}
  changeDiscussions(targetList,id);
}

function movieHelper(index, temp){
  index = index * 4 - 4;
  const targetList = [];
  
  let max = 4;
  let i = 0;
  
  for (i = index; i <temp.length && max != 0; i++) {
    targetList.unshift(temp[i]);
    max--;}
  changeMovies(targetList);
};

function createDiscussion(discussion) {
  let newPost = discussionDiv.clone();
  newPost.find(".backGroundImage").attr('src',discussion.img);
  newPost.find(".disTitle").html(discussion.title);
  fetch("/searchUser/"+discussion.user, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }),
  })
  .then((res) => { 
    if (res.status === 200) {
      return res.json()
   }              
  }).then(json => {
    if(json){
      newPost.find(".author").html(json.username);
    }else{
      newPost.find(".author").html('deleted user');
    }
    newPost.on('click',function(event) {
      eraseCookie('discussion')
      delete_cookie('discussion' )
      createCookie('discussion',discussion._id,1)
      window.location.href = "/discussionPage";})
  })
  return newPost;
}

function createMovie(movie) {
   let newPost = movieDiv.clone();
   newPost.find(".backGroundImage").attr('src',movie.poster);
   newPost.find(".movieTitle").html(movie.name);
   newPost.find(".point").html(movie.vote_average.toString());
   newPost.on('click',function(event) {
    eraseCookie('movie')
    createCookie('movie',movie.name,1)
    window.location.href = "/moviePage";
  })
   return newPost;
}


function changeDiscussions(DisList,id){
  let i;
   const targetList = [];
   let newPost;
   for (i = 0; i < DisList.length && i < 4; i++) {
       newPost = createDiscussion(DisList[i]);
       targetList.unshift(newPost);
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
       targetList.unshift(newPost);
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
	  return -(a.vote_average - b.vote_average);
	});
  for (i = 0;i<3;i++){
    let curDiv = bannerDiv[i]
    curDiv.children[0].src=temp[i].banner
  }

}