"use strict"

// Helper functionf for movie page

function updateVote(movie){
    const temp =  $('#movieRating')
    temp.html(movie.vote_average+'/10')
}

function changeBanner(movie){
    const banner = $('#banner .w-100')
    const bannerTitle = $('#bannerTitle')
    bannerTitle.html(movie.name);
    banner.attr('src',movie.banner)
}

// Creates a discussion div based on given discussion object
function createDiscussion(discussion) {
    let newPost = template.clone();
    const target = newPost.children().children();
    
    let img = target.find(".postImg");
    let text = target.find(".card-text");
    let newTitle = target.find(".card-title");
    let upVote = target.find(".upVoteNumber");
    let container = target.find('.thumbContainer')[0];
    
    container.addEventListener('click', upVoteDis)
    target[3].addEventListener('click',deletePost);
    newTitle.on('click',function(event) {
        eraseCookie('discussion')
        createCookie('discussion',discussion._id,1)
        window.location.href = "/discussionPage";});
    img.attr('src',discussion.img);
    text.html(discussion.discussion_content);
    newTitle.html(discussion.title);
    upVote.html(discussion.likes.toString());
 
    fetch('/canEdit/'+discussion._id).
    then(response => {
     return response.json()}).
    then(result=>{
        if(result == false){
            target[3].remove() 
        }
    })
    return newPost;
 }

function updateTopicNum(movieId) {
    fetch('/getMovieDisCount/'+movieId)
    .then((res) => { 
      if (res.status === 200) {
         return res.json() 
     } else {
          alert('Could not get discussions numer')
     }                
    })
  .then((json) => {
      const temp = $('#discussionTopic')
      temp.html(json.value)
  }).catch((error) => {
      console.log(error)
  })
}

function updateTotalLike(movieId){
    fetch('/totalLikesMovie/'+movieId)
    .then((res) => { 
      if (res.status === 200) {
         return res.json() 
     } else {
          alert('Could not get discussions numer')
     }                
    })
  .then((json) => {
      const temp = $('#TotalLikes')
      temp.html(json.value)
  }).catch((error) => {
      console.log(error)
  })
}
