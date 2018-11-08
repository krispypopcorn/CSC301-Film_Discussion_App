"use strict"

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

//Add event-listner
$("#profilePic").on('click', function(event) {window.location.href = "../UserProfile/user_profile.html" + "?para1="+ permission;});
$("#homeLink").on('click', function(event) {window.location.href = "../Homepage/homepage.html" + "?para1="+ permission;});
$("#adminLink").on('click', function(event) {window.location.href = "../AdminDash/admin.html" + "?para1="+ permission;});
$("#signOut").on('click', function(event) {window.location.href = "../Login/index.html";});
$(".card-title").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html" + "?para1="+ permission;});


const html_categories = $('#Categories').children()

var categories = {"discussion_topics":0, "comments":1, "replies":2}

display_category(categories.discussion_topics)

$('#DiscussionTopics').click(display_discussion_topics)
$('#Comments').click(display_comments)
$('#Replies').click(display_replies)



function display_discussion_topics(e){
	e.preventDefault();
	display_category(categories.discussion_topics)
}

function display_comments(e){
	e.preventDefault();
	display_category(categories.comments)
}

function display_replies(e){
	e.preventDefault();
	display_category(categories.replies)
}

function display_category(index){
	if(0 <= index && index <= html_categories.length - 1){
		html_categories[index].style.color = '#3366cc';
		for(let i = 0; i < html_categories.length; i++){
			if(i!== index){
				html_categories[i].style.color = 'white';
			}
		}
	}


	// the following would actually be calls to the server
	if(index == 0){
		change_content_title("Discussion Topic")
	}
	else if (index == 1){
		change_content_title("Comment")
	}
	else if(index == 2){
		change_content_title("Reply")
	}



}

function change_content_title(new_title){
	const content_titles = document.getElementsByClassName("card-title")
	for(let i = 0; i < content_titles.length; i++){
		content_titles[i].innerText = new_title
	}
}
