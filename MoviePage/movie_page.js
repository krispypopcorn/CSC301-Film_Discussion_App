"use strict"

// number of total discussions under a movie
// we should pull this from server
let numberOfDiscusstions = 4;

class Discussion {
  constructor(title,author,content){
    //read from user input
    this.title = title;
    this author = author;
    this.content=content;
    
    //user can upload pic, hard code source link for now
    this.image = '../Pictures/post.png'
  }
}

class User{
  constructor(username, password){
    this.username = username;
    this.password = password;
  }
}

//array of discussions posted by user
//we should pull this from server
const discussions = []

// Dummy user
const DummyUser = new User("Dummy", "123")

const DummyText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

discussions.push(new Discussion("Title 1", DummyUser, DummyText));
discussions.push(new Discussion("Title 2", DummyUser, DummyText));
discussions.push(new Discussion("Title 3", DummyUser, DummyText));
discussions.push(new Discussion("Title 4", DummyUser, DummyText));




$(document).ready(
  function hide_show(){
    $("#newPost").click(function(){
        $("#popup1").toggle(200);
    });
  }
);

$(document).ready(
    function new_post(){
    newPost = $("#template").clone();
    console.log(newPost);
    $("#subButton").click(function(){
        $("#postsContainer").prepend("<li>Prepended item</li>");
    });
  }
);