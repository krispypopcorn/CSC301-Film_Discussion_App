"use strict";

/*-------------permission check-------------*/
/*----get permission from previous page----*/
/*------should be done through server-----*/
let permission = "none";

let queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
queryString = queryString.split("?")[0];

const index = queryString.indexOf("=");
if(index!=-1){permission = queryString.substring(index+1);}

if(permission=="none"){
   window.location.href = "../Login/index.html";
} else if(permission=="user"){
  $("#adminLink").hide();
}
/*----permission check----*/

/*----How to check permission----*/
// permission == user: user mode 
// permission == admin: admin mode
// permission == none: won't happen. Page will automatically change back to login page
// delete this part after you are done!
/*----How to check permission----*/

//Add event-listner
$("#profilePic").on('click', function(event) {window.location.href = "../UserProfile/user_profile.html" + "?para1="+ permission;});
$("#homeLink").on('click', function(event) {console.log("HI");window.location.href = "../Homepage/homepage.html" + "?para1="+ permission;});
$("#adminLink").on('click', function(event) {window.location.href = "../AdminDash/admin.html" + "?para1="+ permission;});
$("#signOut").on('click', function(event) {window.location.href = "../Login/index.html";});
$(".usn").on('click', function(event) {window.location.href = "../UserProfile/user_profile.html" + "?para1="+ permission;});
$("#bannerText").on('click', function(event) {window.location.href = "../MoviePage/movie_page.html" + "?para1="+ permission;});
/*----navigate to another page----*/
// you need to pass your permission to the next page
// window.location.href = "../UserProfile/user_profile.html" + "?para1="+ permission
/*----navigate to another page----*/


$("#replyPost").on('click', createReply);



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

function replyToPost(postToReplyTo){
	


}




function createPost(){

	let text = document.getElementById('postText');

	let post = document.createElement('div');
	post.className("card reply");
	innerDiv1 = document.createElement('div');
	innerDiv1.className("row no-gutters");
	innerDiv2 = document.createElement('div');
	innerDiv2.className("col");






	return post;

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



function createReply(e){

	let comments = document.getElementById("comments");

	e.preventDefault();
	let text = document.getElementById("postText").value;


	let reply = document.createElement("div");
	reply.classList.add("card");
	reply.classList.add("border-dark");

	let row = document.createElement("div");
	row.classList.add("row"); 
	row.classList.add("no-gutters");

	let col = document.createElement("div");
	col.classList.add("col");

	let card_block = document.createElement("div");
	card_block.classList.add("card-block"); 
	card_block.classList.add("px-2");

	let card_text = document.createElement("p");
	card_text.classList.add("card-text");
	let in_text = document.createTextNode(text);
	

	card_text.append(in_text);
	card_block.append(card_text);
	col.append(card_block);


	let row_footer = document.createElement('div');
	row_footer.classList.add("row");
	row_footer.classList.add("card-footer");
	row_footer.classList.add("w-100");
	row_footer.classList.add("text-muted");

	let footer_text_div = document.createElement("p");
	let footer_text = document.createTextNode("Post by USERNAME");
	footer_text_div.append(footer_text)


	let reply_footer_btn = document.createElement('a');
	reply_footer_btn.classList.add("btn");
	reply_footer_btn.classList.add("btn-primary");
	reply_footer_btn.classList.add("col-sm-1");
	reply_footer_btn.classList.add("offset-sm-9");


	let strong = document.createElement('strong');
	let button_text = document.createTextNode("Reply");
	strong.append(button_text);
	reply_footer_btn.append(strong)

	
	row_footer.append(footer_text_div)
	row_footer.append(reply_footer_btn)



	row.append(col);

	reply.append(row);
	reply.append(row_footer)

	comments.append(reply);
}


























































