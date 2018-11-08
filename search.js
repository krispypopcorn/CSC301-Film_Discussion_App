
$("#movieSearchButton").on('click',displaySearch);
$("#movieSearch").keyup(function(event) {
  $("#movieSearchButton").click();
});

//store current page
let currentPage = 1;

//array of movies
//we should pull this from server
const movies = [];

//store search result
let search = [];

//keep a copy of the discussion div as template
const template = $(".result:first").clone();


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
   search = [];
   currentPage = 1;
   const inputTitle = $("#movieSearch").val();
   if(inputTitle!=''){
      let i;
      //we should pull the movie list from server
      for (i = 0; i < movies.length; i++) {
           let cur = movies[i];
          if (cur.title.includes(inputTitle)) {
               search.push(cur);
          }
      }
      addSearchToDom(search);
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
   let newPost = template.clone();
   let movieTitle = newPost.children()[1].children[0];
   let movieImg=newPost.children()[0].children[0];
   movieTitle.innerHTML=movie.title;
   movieImg.src=movie.image;
   return newPost;
   
}
