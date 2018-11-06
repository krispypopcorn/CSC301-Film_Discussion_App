"use strict"

$(document).ready(
  
  function hide_show(){
    $("#newPost").click(function(){
        $("#popup1").toggle(200);
    });
    
  function new_post(){
    
    $("#subButton").click(function(){
        $("#postsContainer").prepend("<li>Prepended item</li>");
    });
  }
    
});