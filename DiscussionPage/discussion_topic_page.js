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

// if(permission=="none"){
//    window.location.href = "../Login/index.html";
// } else if(permission=="user"){
//   $("#adminLink").hide();
// }
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

/*----navigate to another page----*/
// you need to pass your permission to the next page
// window.location.href = "../UserProfile/user_profile.html" + "?para1="+ permission
/*----navigate to another page----*/


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


}fillBanner();

























































