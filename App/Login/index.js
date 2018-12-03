"use strict"

$("#login_btn").click(checkPermission);

$("#SignUpPage").on('click',function(event) {
    console.log("here")
    window.location.href = "/SignUp";});

let msg=false;

const url = '/users/login'

function checkPermission(e){
    e.preventDefault()
    const username = $('#username').val();
    const password = $('#password').val();
    var params = {
        "username": username,
        "password": password
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        credentials: 'include',
    }).then(res=>{
        if (res.status === 200) {
            window.location.href = "/adminDash"
        } else {
            if(!msg){
                show_invalid_msg();
                msg=true;
            }
        }             
    })    
};

function show_invalid_msg(){
    const invalid_msg = document.createElement('div')
    invalid_msg.append(document.createTextNode('Invalid username or password'))
    invalid_msg.style.color = 'white';
    $('#login_btn').before(invalid_msg)
    invalid_msg_on_screen = true;
}

