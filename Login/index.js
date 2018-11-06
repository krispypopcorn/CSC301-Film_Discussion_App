const fs = require('fs')

class User{
    constructor(username, password, permission) {
        this.username=username;
        this.password=password;
        this.permission=permission;
    }
}

const user = new User("MyUserName","password","user");
const admin = new User("AdminUserName","password","admin");

//Add eventlistener
$("#login").click(checkPremission);

function checkPremission(e){
    const userName = $('#username').val();
    const passWord = $('#password').val();

    if (userName==user.username && passWord==user.password){
        fs.writeFileSync('students.json', JSON.stringify(user));
        window.location.href = "../Homepage/homepage.html";
    }
    else if (userName==admin.username && passWord==admin.password){
        fs.writeFileSync('students.json', JSON.stringify(admin));
        window.location.href = "../AdminDash/admin.html";
    }
    else{
        notUser();
    }
}

function notUser(){
    
}


