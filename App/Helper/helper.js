'use strict'
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