"use strict"

//Add event-listener
window.location.href="index.html#";
$(".login_btn").click(checkPremission);

function checkPremission(e){
    const userName = $('#username').val();
    const passWord = $('#password').val();
	  console.log("userName")

    if (userName=="MyUserName" && passWord=="password"){
        let queryString = "?para1=user"
        window.location.href = "../Homepage/homepage.html" + queryString;
    }
    else if (userName=="AdminUserName" && passWord=="password"){
        let queryString = "?para1=admin"
        window.location.href = "../AdminDash/admin.html" + queryString;
    }
    else{
        notUser();
    }
}

function notUser(){
    
}


