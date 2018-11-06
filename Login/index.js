"use strict"

$(".login_btn").click(checkPremission);

function checkPremission(e){
    e.preventDefault()

    const userName = $('#username').val();
    const passWord = $('#password').val();

    if (userName=="MyUserName" && passWord=="password"){
        let queryString = "?para1=user"
        //window.location.href = "../Homepage/homepage.html" + queryString;
        window.open("../Homepage/homepage.html" + queryString);
    }
    else if (userName=="AdminUserName" && passWord=="password"){
        let queryString = "?para1=admin"
        //window.location.href = "../AdminDash/admin.html" + queryString;
        window.open("../Homepage/homepage.html" + queryString);
    }
    else{
        notUser();
    }
}

function notUser(){
    
}

