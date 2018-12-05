"use strict"
$("#movieSearchButton").on('click',displaySearch);
$("#movieSearch").keyup(function() {
  $("#movieSearchButton").click();
});
$(".NavSearchButtonLeft").on('click',getPreviousPage);
$(".NavSearchButtonRight").on('click',getNextPage);

//store current page
let curPage = 1;

//array of movies
let movies = [];

//store search result
let results = [];

//keep a copy of the movie div as template
const temp = $(".result:first").clone();
getMovie()


function getMovie(){
   fetch('/findAllMovies')
   .then((res) => { 
       if (res.status === 200) {
          return res.json() 
      } else {
           alert('Could not get movies')
      }                
   })
   .then((json) => {
     movies=json;
   }).catch((error) => {
       console.log(error)
   })
 }

function displaySearch(e){
   e.preventDefault()
   results = [];
   curPage = 1;
   const inputTitle = $("#movieSearch").val().toLowerCase();
   if(inputTitle!=''){
      let i;
      for (i = 0; i < movies.length; i++) {
           let cur = movies[i];
          if (cur.name.toLowerCase().includes(inputTitle)) {
               results.push(cur);
          }
      }
      addSearchToDom(results);
      $("#searchResult").show();
   }
   else{
     $("#searchResult").hide();
   }
    
}

function addSearchToDom(searchList){
   let i;
   const targetList = [];
   let newPost;
   for (i = 0; i < searchList.length && i < 4; i++) {
      newPost = createSearchResult(searchList[i]);
      targetList.push(newPost);
   }

   $('#searchWraper .result').remove();

   for (i = 0; i < searchList.length; i++) {
       $("#searchWraper").append(targetList[i]);
   }
  
}

function getPreviousPage(e) {
   e.preventDefault();
   if (curPage != 1) {

      let index = curPage - 1;
      curPage--;
      index = index * 4 - 4;
      const targetList = [];
       
      let max = 4;
      let i = 0;

      for (i = index; i < results.length && max != 0; i++) {
         targetList.push(results[i]);
         max--;
      }
      addSearchToDom(targetList);
   }
}

function getNextPage(e) {
   e.preventDefault();

   const maxPage = Math.ceil(results.length / 4);

   if (curPage != maxPage) {
      let index = curPage + 1;
      curPage++;
      index = index * 4 - 4;
      const targetList = [];

      let max = 4;
      let i = 0;

      for (i = index; i < results.length && max != 0; i++) {
         targetList.push(results[i]);
         max--;
      }
      addSearchToDom(targetList);
   }
}


function createSearchResult(movie) {
   let newPost = temp.clone();
   newPost.find(".searchTitle").html(movie.name);
   newPost.find(".resultImg").attr('src',movie.poster);
   newPost.find(".searchTitle").on('click',function(e){
      eraseCookie('movie')
      createCookie('movie',movie.name,1)
      window.location.href = "/moviePage";
   })
   return newPost;

}
