"use strict";

//Add event-listner
$("#profilePic").on('click', function(event) {window.location.href ='/profilePage'});
$("#homeLink").on('click', function(event) {window.location.href = "/home"});
$("#adminLink").on('click', function(event) {window.location.href = "/adminDash";});
$("#signOut").on('click', function(event) {window.location.href = "/logout";});
$(".usn").on('click', function(event) {window.location.href = "/profilePage";});
$("#bannerText").on('click', function(event) {window.location.href = '/moviePage'});
/*----navigate to another page----*/
// you need to pass your permission to the next page
// window.location.href = "../UserProfile/user_profile.html" + "?para1="+ permission
/*----navigate to another page----*/


$("#replyPost").on('click', replyToDiscussion);
$(".reply").on('click', replyToPost);
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

	let disc = document.getElementById('discussion');
	let disc_img = disc.firstElementChild.firstElementChild;
	let disc_post = disc.firstElementChild.nextElementSibling.firstElementChild;
	let disc_post_title = disc_post.firstElementChild;
	let disc_post_text = disc_post_title.nextElementSibling;

	//Then populate fields!



};


function fillBanner(){

	//access banner
	let bannerImg = document.getElementById('bannerImg');
	let bannerTitle = document.getElementById('bannerTitle');
	let bannerText = document.getElementById('bannerText');

	//pop the fields


};

function deleteComment(e){
	e.preventDefault();

	//required: PERMISSION CHECK
	let comments = e.target.parentElement.parentElement.parentElement;

	let postToRemove = e.target.parentElement.parentElement;
	comments.removeChild(postToRemove);
}



function replyToPost(e){
	e.preventDefault();
	let postToreplyTo = e.target.parentElement.parentElement;

	let text = prompt("Reply to Post", );

	if (text){

	postToreplyTo.appendChild(createPost(text));

	}
}



function createPost(text){

	if (text){
		let reply = document.createElement("div");
		reply.className = "card border-dark";

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
		usn.id = "yellow";
		let usn_text = null;
		if (permission == 'user'){
			usn_text = document.createTextNode("James"); //get usn from server
		}else{usn_text = document.createTextNode("Admin");} //get usn from server}
		usn.append(usn_text);

		footer_text_div.append(footer_text);
		footer_text_div.append(usn);


		let reply_footer_btn = document.createElement('button');
		reply_footer_btn.type = "button";
		reply_footer_btn.className = 'reply col-md-1 offset-md-9'
		let button_text = document.createTextNode("Reply");
		reply_footer_btn.append(button_text)

		$(reply_footer_btn).on('click', replyToPost);
		
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





// <div class="card border-dark">
//         <div class="row no-gutters">
//             <div class="col">
//                 <div class="card-block px-2">
//                     <p class="card-text">Galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum</p>

//                 </div>
//             </div>
//         </div>
//         <div class="row card-footer w-100 text-muted">
//             <p class='col-sm-2'>Post by <a id="yellow" class='usn'>USERNAME</a></p>
//             <a href="#" id='reply' class="btn btn-primary col-sm-1 offset-sm-9"><strong>Reply</strong></a>
//         </div>
//     </div>


function createReply(){
	let text = document.getElementById("postText").value;

	if (text){
		let reply = document.createElement("div");
		reply.className = "card";

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
		usn.id = "yellow";
		let usn_text = null;
		if (permission == 'user'){
			 usn_text = document.createTextNode("James"); //get usn from server
		}else{ usn_text = document.createTextNode("Admin");}
		usn.append(usn_text);

		footer_text_div.append(footer_text);
		footer_text_div.append(usn);


//<button type=button class='reply col-md-1 offset-md-9 '>Reply</button>
		let reply_footer_btn = document.createElement('button');
		reply_footer_btn.type = "button";
		reply_footer_btn.className = 'reply col-md-1 offset-md-9'
		let button_text = document.createTextNode("Reply");
		reply_footer_btn.append(button_text)

		$(reply_footer_btn).on('click', replyToPost);
		
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
function replyToDiscussion(e){
	e.preventDefault();

	let comments = document.getElementById("comments");

	let reply = createReply();
	if (reply){
		if (comments.firstElementChild){
		comments.insertBefore(reply, comments.firstElementChild);
		}else {
			comments.appendChild(reply);
		}
	}
	
}
