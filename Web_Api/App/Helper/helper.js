'use strict'

$("#popupCloseButton").on('click',function(){
  $(".hover_bkgr_fricc").hide();
})

function setUserIcon(){
    fetch('/userIcon')
    .then(res =>{
      if (res.status === 200) {
           return res.json() 
       } else {
         console.log('Could not get user icon')
       }                
    })
    .then(url =>{
      $('#profilePic').attr('src',url)
    })
  }

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

function createCookie(name,value,days) {
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000));
      var expires = "; expires=" + date.toGMTString();
  } else {
      var expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function  getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') {
          c = c.substring(1,c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
          return c.substring(nameEQ.length,c.length);
      }
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}

// only use this when younaccidentallyset the cookie value directly!!!
function delete_cookie( name ) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function popUP(msg){
  $('.hover_bkgr_fricc').show()
  $('#warningContent').html(msg)
}