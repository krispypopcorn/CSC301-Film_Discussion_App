"use strict";

//const discId = getCookie('discussionId');

let thisDiscussion = null;
let thisMovie = null;
let movieId = "";

/*-------request URL-------*/
const discussionUrl = '/getDiscussion/'
const MovieUrl = '/getMovie/'
const newComment = '/createComment/'
const createReply = '/createReply/'

/*-------request URL-------*/

function getDiscussion(){
    fetch(discussionUrl+discId)
    .then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get the discussion')
       }                
    })
    .then((json) => {
    	thisDiscussion = json;
    	movieId = json.movie;
    })
}

function getMovie(){

    fetch(MovieUrl+movieId)
    .then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get movies')
       }                
    })
    .then((json) => {
        thisMovie = json
    })
}

// getMovie();
// fillDiscussionPost();
// fillBanner();




//Add event-listner
$("#profilePic").on('click', function(event) {window.location.href ='/profilePage'});
$("#homeLink").on('click', function(event) {window.location.href = "/home"});
$("#adminLink").on('click', function(event) {window.location.href = "/adminDash";});
$("#signOut").on('click', function(event) {window.location.href = "/logout";});
$(".usn").on('click', function(event) {window.location.href = "/profilePage";});
$("#bannerText").on('click', function(event) {window.location.href = '/moviePage'});
$("#replyToDiscussion").on('click', commentOnDiscussion);
$(".reply").on('click', replyToComment);
$(".close").on('click', deleteComment);

checkUserClass()

function checkUserClass(){
  fetch('/userClass')
  .then(res =>{
    if (res.status === 200) {
         return res.json() 
     } else {
       console.log('Could not get user class')
     }                
  })
  .then(json =>{
    if(json == false){
      $('#adminLink').hide()
    }
  })
}

function fillDiscussionPost(){

	//accessing Discussion Post elements (img, title, text) 
	let disc_img = document.getElementById('postImg')
	let disc_post_text = document.getElementById('discussionContent')
	let user = document.getElementById('discussionUser');
	let date = document.getElementById('discussionTime')
	//Then populate fields!
	disc_post_text.innerHTML = thisDiscussion.discussion_content;
	disc_img.src = thisDiscussion.img;
	user.html(thisDiscussion.user);
	date.html(date.format(thisDiscussion.date, 'hh:mm A DD/MM/YYYY '));

};


function fillBanner(){

	//access banner
	let bannerImg = document.getElementById('bannerImg');
	let bannerTitle = document.getElementById('bannerTitle');
	let bannerText = document.getElementById('bannerText');

	//pop the fields
	bannerImg.attr('src',thisMovie.banner);
	bannerTitle.html(thisDiscussion.title);
	bannerText.html(thisMovie.name);

};

//fills comments and replies for thisDiscussion
function fillAllComments(){

	let comments = thisDiscussion.comments;

	for (com in comments ){
		fillComment(comments[com]);
		for (var reply in com.replies){
			if (reply){
				fillAllComments(com.replies[reply])
			}
		}
	}
}

//helper that fills the Comment or reply in the DOM.
function fillComment(com){
	if (!com.comment){
		let postToreplyTo = document.getElementById("comments");
	}else{
		let postToreplyTo = document.getElementById(com.comment)
	}
	let reply = createCommentJSON(com);
	if (reply){
		if (comments.firstElementChild){
		comments.insertBefore(reply, comments.firstElementChild);
		}else {
			comments.appendChild(reply);
		}
	}
}

function deleteComment(e){
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


		//db.bios.find( { _id: 5 } )
		fetch('/deleteComment/'+thisDiscussion._id+'/'+postToRemove.id, {
	    method: 'DELETE', }).then(response => {
	      getDiscussions(currentMovie._id)
	      updateTopicNum(currentMovie._id)
		})
	}

}



function replyToComment(e){
	e.preventDefault();
	let postToreplyTo = e.target.parentElement.parentElement;

	let text = prompt("Reply to Comment", );

	if (text){

		postToreplyTo.appendChild(createReply(text));

	}
}


function createReply(text, postToreplyTo){

	if (text){
		let date = new Date();
		let usn_text = "";
		let replyId = "";
		const newReply = {
			comment_content: text,
		    date: date,
		    comment: postToreplyTo;
		}

		fetch(createReply+thisDiscussion._id, {
            method: 'POST', 
            body: JSON.stringify(newComment), 
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            credentials: 'include',
          })
          .then(response => {
          	usn_text = document.createTextNode(response.user);
          	replyId = response._id;
        })
		let reply = document.createElement("div");
		reply.className = "card comment";
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
		let footer_text = document.createTextNode("Reply by ");
		let usn = document.createElement("a");
		usn.className = 'usn';

		usn.append(usn_text);

		footer_text_div.append(footer_text);
		footer_text_div.append(usn);


		let reply_footer_btn = document.createElement('button');
		reply_footer_btn.type = "button";
		reply_footer_btn.className = 'reply col-md-1 offset-md-9'
		let button_text = document.createTextNode("Reply");
		reply_footer_btn.append(button_text)

		$(reply_footer_btn).on('click', replyToComment);
		
		row_footer.append(footer_text_div)
		row_footer.append(reply_footer_btn)


		row.append(col);

	
		let close_button = document.createElement('button')
		close_button.type = 'button';
		close_button.className = "close col-sm-1 offset-sm-11"	
		let close_span = document.createElement('span')
		close_span.setAttribute('aria-hidden', 'true');
		close_span.innerHTML = '&times;';
		close_button.append(close_span)

		$(close_button).on('click', deleteComment);

		reply.append(close_button);
		reply.append(row);
		reply.append(row_footer);


		return reply;
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

function createComment(){
	let text = document.getElementById("postText").value;

	if (text){
		let date = new Date();
		let usn_text = "";
		let replyId = "";
		const newComment = {
			comment_content: text,
		    date: date,
		}

		fetch(newComment+thisDiscussion._id, {
            method: 'POST', 
            body: JSON.stringify(newComment), 
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            credentials: 'include',
          })
          .then(response => {
          	usn_text = document.createTextNode(response.user);
          	replyId = response._id;
        })

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

		
		let date_text = document.createTextNode('on ' + date);

		footer_text_div.append(footer_text);
		footer_text_div.append(usn);
		footer_text_div.append(date_text);

		let reply_footer_btn = document.createElement('button');
		reply_footer_btn.type = "button";
		reply_footer_btn.className = 'reply col-md-1 offset-md-9'
		let button_text = document.createTextNode("Reply");
		reply_footer_btn.append(button_text)

		$(reply_footer_btn).on('click', replyToComment);
		
		row_footer.append(footer_text_div)
		row_footer.append(reply_footer_btn)


		row.append(col);

	
		let close_button = document.createElement('button')
		close_button.type = 'button';
		close_button.className = "close col-sm-1 offset-sm-11"	
		let close_span = document.createElement('span')
		close_span.setAttribute('aria-hidden', 'true');
		close_span.innerHTML = '&times;';
		close_button.append(close_span)

		$(close_button).on('click', deleteComment);

		reply.append(close_button);
		reply.append(row);
		reply.append(row_footer);


		return reply;
	}

}

function createCommentJSON(comment){
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
		//get and set ID from sserv
		let usn_text = comment.user;
		usn.append(usn_text);

		let date_text = document.createTextNode(comment.date);

		footer_text_div.append(footer_text);
		footer_text_div.append(usn);
		footer_text_div.append(date_text);

		let reply_footer_btn = document.createElement('button');
		reply_footer_btn.type = "button";
		reply_footer_btn.className = 'reply col-md-1 offset-md-9'
		let button_text = document.createTextNode("Reply");
		reply_footer_btn.append(button_text)

		$(reply_footer_btn).on('click', replyToComment);
		
		row_footer.append(footer_text_div)
		row_footer.append(reply_footer_btn)


		row.append(col);

	
		let close_button = document.createElement('button')
		close_button.type = 'button';
		close_button.className = "close col-sm-1 offset-sm-11"	
		let close_span = document.createElement('span')
		close_span.setAttribute('aria-hidden', 'true');
		close_span.innerHTML = '&times;';
		close_button.append(close_span)

		$(close_button).on('click', deleteComment);

		reply.append(close_button);
		reply.append(row);
		reply.append(row_footer);


		return reply;
	}

}



//reply to main discussion-post
function commentOnDiscussion(e){
	e.preventDefault();

	let comments = document.getElementById("comments");

	let reply = createComment();
	if (reply){
		if (comments.firstElementChild){
		comments.insertBefore(reply, comments.firstElementChild);
		}else {
			comments.appendChild(reply);
		}
	}
	
}
