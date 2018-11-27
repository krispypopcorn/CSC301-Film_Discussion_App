"use strict"

$("#login_btn").click(checkPermission);

let msg=false;

const url = 'http://localhost:8000/users/login'
let invalid_msg_on_screen = false

function checkPermission(e){
    e.preventDefault()
    const username = $('#username').val();
    const password = $('#password').val();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    var params = {
        "username": username,
        "password": password
      };

    xhr.send(JSON.stringify(params));

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 400){
            if(!msg){
                show_invalid_msg();
                msg=true;
            }
        }else if(xhr.readyState == 4 && xhr.status == 200){
            window.location.href = "http://localhost:8000/home"
        };
    };
    
};

function show_invalid_msg(){
    const invalid_msg = document.createElement('div')
    invalid_msg.append(document.createTextNode('Invalid username or password'))
    invalid_msg.style.color = 'white';
    $('#login_btn').before(invalid_msg)
    invalid_msg_on_screen = true;
}

