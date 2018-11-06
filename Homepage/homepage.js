"use strict"

/*-------------Premission check-------------*/
/*----get premission from previous page----*/
/*------should be done through server-----*/
let premission = "none";

let queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
queryString = queryString.split("?")[0];

const index = queryString.indexOf("=");
if(index!=-1){premission = queryString.substring(index+1);}

if(premission=="none"){
   window.location.href = "../Login/index.html";
} else if(premission=="user"){
  $("#adminLink").hide();
}
/*----Premission check----*/


$("#Latest .column").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html" + "?para1="+ premission;});
$("#MostPopular .column").on('click', function(event) {window.location.href = "../DiscussionPage/discussion_topic_page.html" + "?para1="+ premission;});
$("#Movie .column").on('click', function(event) {window.location.href = "../MoviePage/movie_page.html" + "?para1="+ premission;});
$("#homeLink").on('click', function(event) {window.location.href = "homepage.html" + "?para1="+ premission;});
$("#adminLink").on('click', function(event) {window.location.href = "../AdminDash/admin.html" + "?para1="+ premission;});
$("#signOut").on('click', function(event) {window.location.href = "../Login/index.html";});