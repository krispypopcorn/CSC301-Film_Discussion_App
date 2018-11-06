"use strict"

let premission = "none";

// get premission from login page
// we should pull this from server
let queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
queryString = queryString.split("&")[0];

const index = queryString.indexOf("=");
if(index!=-1){premission = queryString.substring(index+1);}

if(premission=="none"){
   window.location.href = "../Login/index.html";
}