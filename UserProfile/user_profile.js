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