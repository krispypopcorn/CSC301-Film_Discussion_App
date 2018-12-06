"use strict";

const discId = getCookie('discussion');

let thisDiscussion = null;
let thisMovie = null;
let movieName = "";
let movieId = "";
let thisUser = null;
let discussionUser = null;

let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
	 "October", "November", "December"]

/*-------request URL-------*/
const discussionUrl = '/getDiscussion/'
const commentUrl = '/getComment/'
const MovieUrl = '/getMovie/'
const newComment = '/createComment/'
const replyUrl = '/createReply/'

/*-------request URL-------*/

setUserIcon();
getUser();
checkUserClass();


function getDiscussion(){
    fetch(discussionUrl+discId)
    .then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get the discussion')
       }                
    })
    .then((json) => {''
    	thisDiscussion = json;
    	movieId = json.movie;
    	getDiscUserById(json.user)
    	getMovie();
    })
}


function getMovie(){
    fetch('/getMovie/'+movieId).then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get movies')
       }                
    }).then((json) => {
        thisMovie = json
        movieName = thisMovie.name;
        fillDiscussionPost();
    })
}

function getUser(){

    fetch("/user").then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get movies')
       }                
    }).then((json) => {
        thisUser = json;
    }).then((data) => {
		fetch(discussionUrl+discId).then((res) => { 
			if (res.status === 200) {
			   return res.json() 
		   } else {
				alert('Could not get the discussion')
		   }                
		}).then((json) => {''
			thisDiscussion = json;
			movieId = json.movie;
			return json.user
			getDiscUserById(json.user)
			getMovie();
		}).then((user_data) => {
			fetch("/getUser/"+user_data).then((res) => { 
        	if (res.status === 200) {
           		return res.json() 
       		} else {
            	alert('Could not get movies')
       		}                
    		}).then((json) => {
        		discussionUser = json;
			}).then((irr) => {
				fetch('/getMovie/'+movieId).then((res) => { 
					if (res.status === 200) {
					   return res.json() 
				   } else {
						alert('Could not get movies')
				   }                
				}).then((json) => {
					thisMovie = json
					movieName = thisMovie.name;
					fillDiscussionPost();
				})
			})
		})
	})
}

function getUserById(id){

    fetch("/getUser/"+id)
    .then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get movies')
       }                
    })
    .then((json) => {
        commentsUser = json;
    })
}


function getDiscUserById(id){

    fetch("/getUser/"+id)
    .then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get movies')
       }                
    })
    .then((json) => {
        discussionUser = json;
    })
}




//Add event-listner
$("#profilePic").on('click', function(event) {
	event.preventDefault();
  eraseCookie('isCurrentUser')
  createCookie('isCurrentUser','true',1)
  window.location.href = "/profilePage";});
$("#homeLink").on('click', function(event) {event.preventDefault();window.location.href = "/home"});
$("#adminLink").on('click', function(event) {event.preventDefault(); window.location.href = "/adminDash";});
$("#signOut").on('click', function(event) {event.preventDefault(); window.location.href = "/logout";});
$(".usn").on('click', function(event) {
	event.preventDefault();
	let usn = event.target.innerHTML;
	eraseCookie('User')
	eraseCookie('isCurrentUser')
	createCookie('isCurrentUser','false',1)
	createCookie('User', usn, 1)
	window.location.href = "/profilePage";});
$("#bannerText").on('click', function(event) {
	event.preventDefault();
        eraseCookie('movie')
        createCookie('movie',movieName,1)
        window.location.href = "/moviePage";});
$("#replyToDiscussion").on('click', commentOnDiscussion);
$(".reply").on('click', replyToComment);
$(".com reply").on('click', deleteComment);
$(".rep reply").on('click', deleteReply);
$("#deletePost").on('click', deleteDiscussion);



function fillDiscussionPost(){

	//accessing Discussion Post elements (img, title, text) 
	let disc_img = document.getElementById('postImg')
	let disc_post_text = document.getElementById('discussionContent')
	let user = document.getElementById('discussionUser');
	let date = document.getElementById('discussionTime')
	//Then populating fields!
	disc_post_text.innerHTML = thisDiscussion.discussion_content;
	disc_img.src = thisDiscussion.img;
	user.innerHTML= discussionUser.username;
	
	let date_unformatted = new Date(thisDiscussion.date);
	let day = days[date_unformatted.getDay()];
	let hour = date_unformatted.getHours();
	let minute = date_unformatted.getMinutes()
	let month = months[date_unformatted.getMonth()]
	let dateNum = date_unformatted.getDate()
	let year = date_unformatted.getFullYear();
	
	let dateString = day + ', ' + dateNum + " " + month + " " + year + ' at ' + hour + ': ' + minute;
	date.innerHTML = dateString;
	fillBanner();
	fillAllComments(thisDiscussion.comments);

};


function fillBanner(){
	//access banner
	let bannerImg = document.getElementById('bannerImg');
	let bannerTitle = document.getElementById('bannerTitle');
	let bannerText = document.getElementById('bannerText');

	//pop the fields
	bannerImg.src = thisMovie.banner;
	bannerTitle.innerHTML = thisDiscussion.title;
	bannerText.innerHTML = thisMovie.name;

};

//fills comments and replies for thisDiscussion
function fillAllComments(comments){

	if (comments.length > 0){
		for (var i=0; i < comments.length; i++){
		fetch('/getComment/'+ comments[i])
	    .then((res) => { 
	        if (res.status === 200) {
	           return res.json() 
	       } else {
	            //alert('Could not get the comment')
	       }                
	    })
	    .then((json) => {
	    if (json){fillComment(json)
		    if (json.replies.length > 0){
		    	fillAllreplies(json.replies);
		    }
		}
	    })
		
	}

	}
	
	
}
function fillAllreplies(replies){

	if (replies.length > 0){
		for (var i=0; i < replies.length; i++){
		fetch('/getComment/'+ replies[i])
	    .then((res) => { 
	        if (res.status === 200) {
	           return res.json() 
	       } else {
	            //alert('Could not get the comment')
	       }                
	    })
	    .then((json) => {
	    if (json){fillComment(json)
		    if (json.replies.length > 0){
		    	fillAllComments(json.replies);
		    }
		}
	    })
		
	}

	}
	
	
}

//func that fills the Comment or reply in the DOM.
function fillComment(com){
	let isComment = true;
	let postToreplyTo = document.getElementById("comments")
	if (com.comment){
		postToreplyTo = document.getElementById(com.comment);
		isComment = false;
	}
	createCommentJSON(com, isComment, postToreplyTo);
	
}

function deleteDiscussion(e){
	e.preventDefault();

	//required: PERMISSION CHECK

	let canEdit= false;

	fetch('/canEdit/'+thisDiscussion._id).then(response => {
    	return response.json()}).then(result=>{
       		if(result == true){
           		canEdit = true;
       		}else {
       			return null;
       		}
   		})

	if (canEdit){

		let comments = e.target.parentElement.parentElement.parentElement;

		let postToRemove = e.target.parentElement.parentElement;
		comments.removeChild(postToRemove);



		fetch('/deleteDiscussions/'+thisDiscussion._id, {
	    method: 'DELETE', }).then(response => {
	      	fetch('/home')
		})
	}

}






function deleteReplies(replies){

	for (var i= 0; i < replies; i++){
		let cid = replies[i];
		fetch('/getReplies/'+cid).then((replies) => {
		if (replies.length > 0){
			deleteReplies(replies, cid);
		}})
		fetch('/deleteComment/'+ cid, {method: 'DELETE'});
	}
}


function deleteComment(e){
	e.preventDefault();

	let comments = e.target.parentElement.parentElement.parentElement;

	let postToRemove = e.target.parentElement.parentElement;
	fetch('/getComment/'+postToRemove.id)
    .then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get the discussion')
       }                
    })
    .then((json) => {
    	let parentComment = thisDiscussion._id
	    	if (thisUser._id == json.user){
	    	fetch('/getReplies/'+postToRemove.id)
		    .then((replies) => {
		    	//if (replies.length > 0){deleteReplies(replies)}
				fetch('/deleteComment/'+parentComment+'/'+postToRemove.id, {
			    method: 'DELETE'}).then(response => {
				comments.removeChild(postToRemove);
				})
		    })
	}else{
    	alert("You do not have permission to delete this element")
    }
    })
	
}

function deleteReply(e){
	e.preventDefault();

	let comments = e.target.parentElement.parentElement.parentElement;

	let postToRemove = e.target.parentElement.parentElement;
	fetch('/getComment/'+postToRemove.id)
    .then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get the discussion')
       }                
    })
    .then((json) => {
    	let parentComment = comments.id
    	if (thisUser._id == json.user){
    	fetch('/getReplies/'+postToRemove.id)
	    .then((replies) => {
	    	if (replies.length > 0){deleteReplies(replies)}
			fetch('/deleteReply/'+parentComment+'/'+postToRemove.id, {
		    method: 'DELETE'}).then(response => {
			comments.removeChild(postToRemove);
			})
	    })
	}else{
    	alert("You do not have permission to delete this element")
    }
    })
	
}

function replyToComment(e){
	e.preventDefault();
	let postToreplyTo = e.target.parentElement.parentElement.parentElement;

	let text = prompt("Reply to Comment", );

	if (text){

		createReply(text, postToreplyTo);

	}
}


function createReply(text, postToreplyTo){

	if (text){
		let date = '';
		let usn_text = "";
		let replyId = "";
		let date_unformatted;
		let day;
		let hour;
		let minute;
		let month;
		let dateNum;
		let year;
		const newReply = {
			comment_content: text,
		}
		console.log(postToreplyTo)
		fetch('/createReply/'+postToreplyTo.id, {
            method: 'POST', 
            body: JSON.stringify(newReply), 
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            credentials: 'include',
          })
          .then(response => {
          	let user = thisUser.username
          	usn_text = document.createTextNode(user);
          	replyId = response._id;
          	date_unformatted = new Date (response.date);
			day = days[date_unformatted.getDay()];
			hour = date_unformatted.getHours();
			minute = date_unformatted.getMinutes()
			month = months[date_unformatted.getMonth()]
			dateNum = date_unformatted.getDate()
			year = date_unformatted.getFullYear();
          })
          	date = day + ', ' + dateNum + " " + month + " " + year + ' at ' + hour + ': ' + minute;
          	let reply = document.createElement("div");
			reply.className = "card comment1";
			reply.id = replyId;

			let row = document.createElement("div");
			row.className = "row no-gutters";

			let col = document.createElement("div");
			col.className = "col";

			let card_block = document.createElement("div");
			card_block.className = "card-block px-2";

			let card_text = document.createElement("p");
			card_text.className = "card-text";
			let in_text = document.createTextNode(text);
			

			card_text.append(in_text);
			card_block.append(card_text);
			col.append(card_block);


			let row_footer = document.createElement('div');
			row_footer.className = "row card-footer w-100 text-muted";


			let footer_text_div = document.createElement("p");
			let footer_text = document.createTextNode("Comment by ");
			let usn = document.createElement("a");
			usn.className = 'usn';
			
			usn.append(usn_text);

			
			let date_text = document.createTextNode(' on ' + date);

			footer_text_div.append(footer_text);
			footer_text_div.append(usn);
			footer_text_div.append(date_text);

			let reply_footer_btn = document.createElement('button');
			reply_footer_btn.type = "button";
			reply_footer_btn.className = 'reply'
			let btnDiv = document.createElement("div");
			btnDiv.className = 'col-md-1 offset-md-11'
			
			let button_text = document.createTextNode("Reply");
			
			reply_footer_btn.append(button_text)

			$(reply_footer_btn).on('click', replyToComment);
			btnDiv.append(reply_footer_btn)
			row_footer.append(footer_text_div)
			row_footer.append(btnDiv)


			row.append(col);

		
			let close_button = document.createElement('button')
			close_button.type = 'button';
			close_button.className = "rep close col-sm-1 offset-sm-11"	
			let close_span = document.createElement('span')
			close_span.setAttribute('aria-hidden', 'true');
			close_span.innerHTML = '&times;';
			close_button.append(close_span)

			$(close_button).on('click', deleteComment);

			reply.append(close_button);
			reply.append(row);
			reply.append(row_footer);

			postToreplyTo.append(reply);

	}
}




// <div class="card comment">
//             <button type="button" class="close col-sm-1 offset-sm-11" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//             <div class="row no-gutters">
//                 <div class="col">
//                     <div class="card-block px-2">
//                         <p class="card-text">Galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum</p>

//                     </div>
//                 </div>
//             </div>
//             <div class="row card-footer w-100 text-muted ">
//                 <p class='col-sm-2'>Comment by <a id="yellow" class='usn'>James</a></p>
//                 <button type=button class='reply col-md-1 offset-md-9 '>Reply</button>
//             </div>
//         </div>
//
//
// comment is a relply to a discussions post (main post)
//
//

function createComment(){
	let text = document.getElementById("postText").value;
	let comments = document.getElementById("comments");

	if (text){
		let date;
		let usn_text = "";
		let replyId = "";
		const newComment = {
			comment_content: text,
		}
		let response;
		fetch('/createComment/'+thisDiscussion._id, {
            method: 'POST', 
            body: JSON.stringify(newComment), 
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            credentials: 'include',
          }).then((res) => { 
		        if (res.status === 200) {
		           return res.json() 
		       } else {
		            alert('Could not add Comment')
		       }                
		    }).then((response) => {
		    let user = thisUser.username
          	usn_text = document.createTextNode(user);
          	replyId = response._id;
          	let date_unformatted = new Date (response.date);
			let day = days[date_unformatted.getDay()];
			let hour = date_unformatted.getHours();
			let minute = date_unformatted.getMinutes()
			let month = months[date_unformatted.getMonth()]
			let dateNum = date_unformatted.getDate()
			let year = date_unformatted.getFullYear();
	
			date = day + ', ' + dateNum + " " + month + " " + year + ' at ' + hour + ': ' + minute;
          	
          	let reply = document.createElement("div");
			reply.className = "card comment1";
			reply.id = replyId;

			let row = document.createElement("div");
			row.className = "row no-gutters";

			let col = document.createElement("div");
			col.className = "col";

			let card_block = document.createElement("div");
			card_block.className = "card-block px-2";

			let card_text = document.createElement("p");
			card_text.className = "card-text";
			let in_text = document.createTextNode(text);
			

			card_text.append(in_text);
			card_block.append(card_text);
			col.append(card_block);


			let row_footer = document.createElement('div');
			row_footer.className = "row card-footer w-100 text-muted";


			let footer_text_div = document.createElement("p");
			footer_text_div.className = 'col-md-11'
			let footer_text = document.createTextNode("Comment by ");
			let usn = document.createElement("a");
			usn.className = 'usn';
			
			usn.append(usn_text);

			
			let date_text = document.createTextNode(' on ' + date);

			footer_text_div.append(footer_text);
			footer_text_div.append(usn);
			footer_text_div.append(date_text);

			let reply_footer_btn = document.createElement('button');
			reply_footer_btn.type = "button";
			reply_footer_btn.className = 'reply'
			let btnDiv = document.createElement("div");
			btnDiv.className = 'col-md-1 offset-md-11'
			
			let button_text = document.createTextNode("Reply");
			
			reply_footer_btn.append(button_text)

			$(reply_footer_btn).on('click', replyToComment);
			btnDiv.append(reply_footer_btn)
			row_footer.append(footer_text_div)
			row_footer.append(btnDiv)


			row.append(col);

		
			let close_button = document.createElement('button')
			close_button.type = 'button';
			close_button.className = "com close col-sm-1 offset-sm-11"	
			let close_span = document.createElement('span')
			close_span.setAttribute('aria-hidden', 'true');
			close_span.innerHTML = '&times;';
			close_button.append(close_span)

			$(close_button).on('click', deleteComment);

			reply.append(close_button);
			reply.append(row);
			reply.append(row_footer);


			if (comments.firstElementChild){
				comments.insertBefore(reply, comments.firstElementChild);
			}else {
				comments.appendChild(reply);
			}

		    }) 
        	
	}
}

function createCommentJSON(comment, isComment, postToreplyTo){

	let text = comment.comment_content;

	if (text){

		let reply = document.createElement("div");
		reply.className = "card comment1";
		reply.id = comment._id;

		let row = document.createElement("div");
		row.className = "row no-gutters";

		let col = document.createElement("div");
		col.className = "col";

		let card_block = document.createElement("div");
		card_block.className = "card-block px-2";

		let card_text = document.createElement("p");
		card_text.className = "card-text";
		let in_text = document.createTextNode(text);
		

		card_text.append(in_text);
		card_block.append(card_text);
		col.append(card_block);


		let row_footer = document.createElement('div');
		row_footer.className = "row card-footer w-100 text-muted";


		let footer_text_div = document.createElement("p");
		let footer_text = document.createTextNode("Comment by ");
		let usn = document.createElement("a");
		usn.className = 'usn';
		fetch("/getUser/"+comment.user)
	    .then((res) => { 
	        if (res.status === 200) {
	           return res.json() 
	       } else {
	            alert('Could not get user')
	       }                
	    })
	    .then((json) => {
	        let usn_text = document.createTextNode(json.username);
			usn.append(usn_text);

			let date_unformatted = new Date (comment.date);
			let day = days[date_unformatted.getDay()];
			let hour = date_unformatted.getHours();
			let minute = date_unformatted.getMinutes()
			let month = months[date_unformatted.getMonth()]
			let dateNum = date_unformatted.getDate()
			let year = date_unformatted.getFullYear();
	
			let date = day + ', ' + dateNum + " " + month + " " + year + ' at ' + hour + ': ' + minute;

			let date_text = document.createTextNode(" on " + date);

			footer_text_div.append(footer_text);
			footer_text_div.append(usn);
			footer_text_div.append(date_text);

			let reply_footer_btn = document.createElement('button');
			reply_footer_btn.type = "button";
			reply_footer_btn.className = 'reply'
			let btnDiv = document.createElement("div");
			btnDiv.className = 'col-md-1 offset-md-11'
			
			let button_text = document.createTextNode("Reply");
			
			reply_footer_btn.append(button_text)

			$(reply_footer_btn).on('click', replyToComment);
			btnDiv.append(reply_footer_btn)
			row_footer.append(footer_text_div)
			row_footer.append(btnDiv)



			row.append(col);

		
			let close_button = document.createElement('button')
			close_button.type = 'button';
			if (isComment){
				close_button.className = "com close col-sm-1 offset-sm-11"
			}else{
				close_button.className = "rep close col-sm-1 offset-sm-11"
			}

			let close_span = document.createElement('span')
			close_span.setAttribute('aria-hidden', 'true');
			close_span.innerHTML = '&times;';
			close_button.append(close_span)

			$(close_button).on('click', deleteComment);

			reply.append(close_button);
			reply.append(row);
			reply.append(row_footer);

			if (isComment){
				if (postToreplyTo.firstElementChild){
				postToreplyTo.insertBefore(reply, postToreplyTo.firstElementChild);
				}else {
					postToreplyTo.append(reply);
				}
			} else {
				postToreplyTo.append(reply);
			}
			

		    })
	}

}



//comment on discussion-post (main post)
function commentOnDiscussion(e){
	e.preventDefault();

	

	createComment();
	
}
