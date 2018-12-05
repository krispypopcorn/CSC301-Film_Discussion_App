"use strict"

// number of total discussions under a movie
let numberOfDiscusstions;

//array of discussions posted by user
let discussions = [];

//store search result
let search = [];

//1 if in search mode, 0 otherwise
let searchMode = 0;

//store current page
let currentPage = 1;

// current movie
let currentMovie;

console.log(document.cookie)

//keep a copy of the discussion div as template
const template = $(".card:first").clone();
const movieName = getCookie('movie');

/*-------------Add Event-listener-------------*/
$("#newPost").click(function() {
   $("#popup1").toggle(200);
});
$("#subButton").click(discussionCheck);
$("#discussionSearch").click(displaySearch);
$("#searchTerm").keyup(function(event) {
   if (event.keyCode === 13) {
       $("#discussionSearch").click();
   }
});
$("#cleanSearch").click(restoreDiscussion);
$(".previous").on('click',loadPreviousPage);
$(".next").on('click',loadNextPage);
$("#homeLink").on('click', function(event) {window.location.href = "/home";});
$("#adminLink").on('click', function(event) {window.location.href = "/adminDash";});
$("#signOut").on('click', function(event) {window.location.href = "/logout";});
$("#profilePic").on('click', function(event) {
  eraseCookie('isCurrentUser')
  createCookie('isCurrentUser','true',1)
  window.location.href = "/profilePage";});
$('#star-5').on('click',rate);
$('#star-4').on('click',rate);
$('#star-3').on('click',rate);
$('#star-2').on('click',rate);
$('#star-1').on('click',rate);
$(".delete").on('click', deletePost);
/*-------------Add Event-listener-------------*/

/*-------request URL-------*/
const MovieUrl = '/search/'+movieName
const discussionUrl = '/getMovieDiscussions/'
/*-------request URL-------*/

getMovie()
checkUserClass()
setUserIcon()

function getMovie(){
    fetch(MovieUrl)
    .then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get movies')
       }                
    })
    .then((json) => {
        changeBanner(json)
        currentMovie = json
        updateTopicNum(currentMovie._id);
        getDiscussions(currentMovie._id)
        updateVote(currentMovie)
        updateTotalLike(currentMovie._id)
    })
}

function getDiscussions(movieId){
    fetch(discussionUrl+movieId)
    .then((res) => { 
      if (res.status === 200) {
         return res.json() 
     } else {
          alert('Could not get discussions')
     }                
    })
  .then((json) => {
    discussions=json;
    discussions.sort((a,b)=>{
        return new Date(a.date) - new Date(b.date);
    });
    numberOfDiscusstions = discussions.length
    currentPage++;
    loadPreviousPage();
  })
}

function upVoteDis(e){
    const targetDiv = e.target.parentNode.parentNode.parentNode;
    const targetTitle = targetDiv.children[0].children[1].children[0].children[0].innerHTML
    const target = $(e.target).parent().find('.upVoteNumber')
    fetch('/LikeDiscussion/'+currentMovie._id+'/'+targetTitle, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        credentials: 'include',
    }).then(response => {
        return response.json()
    }).then(likes=>{
        target.html(likes.value)
        updateTotalLike(currentMovie._id)
    }) 
    
}

function rate(e){
    const id =  $(e.target).attr('id')
    const num = parseInt(id.slice(-1))*2
    fetch('/rateMovie/'+currentMovie._id, {
        method: 'POST',
        body: JSON.stringify({"rating":num}),
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        credentials: 'include',
    }).then(response => {
        return response.json()
    }).then(newMovie=>{
        currentMovie = newMovie;
        updateVote(currentMovie)
    }) 
    
}

function discussionCheck(e){
    e.preventDefault();
    const inputTitle = $('#inputTitle').val().trim();
    if(inputTitle==''){
        popUP('Title cannot be empty')
        return 0
    }
    else if( document.querySelector('[type=file]').files.length==0){
        popUP('Please select an image')
        return 0
    }
    else if($('#content').val().trim() == ''){
        popUP('Content cannot be empty')
        return 0
    }
    fetch('/discussionInMovie/'+currentMovie._id+'/'+inputTitle)
    .then(response => {
        return response.json()
    }).then(json =>{
        if(json == true){
            popUP('Discussion already exist')
        }else if(json == false){
            addNewDiscussion()
        }
    })
}

function addNewDiscussion() {
   const inputTitle = $('#inputTitle').val().trim();
   const inputText = $('#content').val().trim();
   const files = document.querySelector('[type=file]').files;
   const formData = new FormData();
   formData.append('photo',files[0]);
   fetch('/uploadImg', {
        method: 'POST',
        body: formData,
    }).then(response => {
        return response.json()
    }).then(url=>{
        const newDiscussion = {
            title:inputTitle,
            discussion_content: inputText,
            movie: currentMovie._id,
            img: url,
            likes: 0
        }
        fetch('/creatDiscussion', {
            method: 'POST', 
            body: JSON.stringify(newDiscussion), 
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            credentials: 'include',
          })
          .then(response => {
            return response.json()
        })
          .then(newDis=>{
            $("#popup1").toggle(200);
            getDiscussions(currentMovie._id)
            updateTopicNum(currentMovie._id)
          })
    });
}

function deletePost(e) {
  e.preventDefault();
  const targetDiv = e.target.parentNode.parentNode.parentNode;
  const targetTitle = targetDiv.children[0].children[1].children[0].children[0].innerHTML
  
  fetch('/deleteDiscussions/'+currentMovie._id+'/'+targetTitle, {
    method: 'DELETE', 
  })
  .then(response => {
      getDiscussions(currentMovie._id)
      updateTopicNum(currentMovie._id)
      if(searchMode == 1){
          let found = false
          let i =0;
          while(!found && i<search.length){
            if(search[i].title == targetTitle){
                found = true;
                search.splice(i,1)
            }  
            i++
          }
      }
})
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
           search.unshift(cur);
       }
   }
   addMultiplyDiscussion(search);
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

function loadNextPage(e) {
   e.preventDefault();
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
function addMultiplyDiscussion(discussionList) {
   let i;
   const targetList = [];
   let newPost;
   for (i = 0; i < discussionList.length && i < 4; i++) {
       newPost = createDiscussion(discussionList[i]);
       targetList.unshift(newPost);
   }

   $('#postsContainer .card').remove();

   for (i = 0; i < targetList.length; i++) {
       $("#postsContainer").append(targetList[i]);
   }
}

function restoreDiscussion() {
   search = [];
   currentPage = 1;
   searchMode = 0;
   let i = 0;
   let newPost;
   const targetList = [];
   for (i = 0; i < discussions.length && i < 4; i++) {
       newPost = createDiscussion(discussions[i]);
       targetList.unshift(newPost);
   }
   $('#postsContainer .card').remove();

   for (i = 0; i < targetList.length; i++) {
       $("#postsContainer").append(targetList[i]);
   }
}
