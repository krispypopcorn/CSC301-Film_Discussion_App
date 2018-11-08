
$("#movieSearchButton").on('click',displaySearch);
$("#movieSearch").keyup(function(event) {
  $("#movieSearchButton").click();
});

//store current page
let curPage = 1;

//array of movies
//we should pull this from server
const movies = [];

//store search result
let results = [];

//keep a copy of the movie div as template
const temp = $(".result:first").clone();


class Movie {
   constructor(title, image) {
       this.title = title;
       this.image = image
   }
}

movies.push(new Movie("Avengers", "../Pictures/movie_pic.jpg"));
movies.push(new Movie("Halloween", "../Pictures/halloween.jpg"));
movies.push(new Movie("The Dark Knight", "../Pictures/thedarkknight.jpg"));
movies.push(new Movie("Venom", "../Pictures/venom.jpeg"));
movies.push(new Movie("Life of Pi", "../Pictures/lifeofpi.jpg"));

function displaySearch(e){
   e.preventDefault()
   results = [];
   curPage = 1;
   const inputTitle = $("#movieSearch").val();
   if(inputTitle!=''){
      let i;
      //we should pull the movie list from server
      for (i = 0; i < movies.length; i++) {
           let cur = movies[i];
          if (cur.title.includes(inputTitle)) {
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

   $('#searchResult .result').remove();

   for (i = 0; i < searchList.length; i++) {
       $("#searchResult").append(targetList[i]);
   }
  
}

function createSearchResult(movie) {
  //      <hr class="w3-white m-0">
   let newPost = temp.clone();
   newPost.find(".searchTitle").html(movie.title);
   newPost.find(".resultImg").attr('src',movie.image);
   newPost.find(".searchTitle").on('click',function(e){window.location.href = "../DiscussionPage/discussion_topic_page.html" + "?para1="+ permission;})
   return newPost;
   
}
