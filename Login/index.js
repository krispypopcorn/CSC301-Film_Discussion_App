"use strict"

$("#login_btn").click(checkPremission);

const username = $('#username');
const password = $('#password');
let invalid_msg_on_screen = false

function checkPremission(e){
    e.preventDefault()

    if (username.val()=="james" && password.val()=="jamespassword"){
        let queryString = "?para1=user"
        window.location.href = "../Homepage/homepage.html" + queryString;
    }
    else if (username.val()=="admin" && password.val()=="adminpassword"){
        let queryString = "?para1=admin"
        window.location.href = "../AdminDash/admin.html" + queryString;
    }

    else{
        if(!invalid_msg_on_screen){
            show_invalid_msg()
        }    
    }
    clear();
}

function clear(){
    username.val('');
    password.val('');
}

function show_invalid_msg(){
    const invalid_msg = document.createElement('div')
    invalid_msg.append(document.createTextNode('Invalid username or password'))
    invalid_msg.style.color = 'white';
    $('#login_btn').before(invalid_msg)
    invalid_msg_on_screen = true;

}

