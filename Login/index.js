"use strict"

class User{
    constructor(username, password, permission) {
        this.username=username;
        this.password=password;
        this.permission=permission;
    }
}

const user = new User("MyUserName","password","user");
const admin = new User("AdminUserName","password","admin");

//Add event-listener
$("#login").click(checkPremission);

function checkPremission(e){
    const userName = $('#username').val();
    const passWord = $('#password').val();
	  console.log("userName")

    if (userName==user.username && passWord==user.password){
        window.location.href = "../Homepage/homepage.html";
    }
    else if (userName==admin.username && passWord==admin.password){
        window.location.href = "../AdminDash/admin.html";
    }
    else{
        notUser();
    }
}

function notUser(){
    
}


