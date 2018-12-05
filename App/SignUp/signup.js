$("#sign_up_btn").on('click',createUser);


const userUrl = '/createUser';


function createUser(e){
	e.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
	const confirmpassword = $('#confirm_password').val();
	

    if(password == confirmpassword){
    	console.log("confirmpassword");

    	let allUsers = null;
	    fetch('/allUsers')
	    .then((res) => { 
	        if (res.status === 200) {
	           return res.json() 
	       } else {
	            alert('Could not get the discussion')
	       }                
	    })
	    .then((json) => {
	    	allUsers = json;
	    })
	    let validUsn = true;
	    let validPswd = false;
	    for (var i in allUsers){
	    	if (allUsers[i].username == username){
	    		validUsn = false
	    	}
	    }

	    if (password.length > 7){
	    	validPswd = true;
	    }

	    if (validUsn && validPswd){
	    	const files = document.querySelector('[type=file]').files;
		    const formData = new FormData();
		    formData.append('photo',files[0]);
		    if (file.length != 0){
		    	fetch('/uploadImg', {
			        method: 'POST',
			        body: formData,
			    }).then(response => {
			        return response.json()
			    }).then(url=>{
				    // check unique username
			    	fetch(userUrl, {
			        method: 'POST',
			        body: JSON.stringify({"username":username, "password": password, "icon": url}),
			        headers: {
			            'Accept': 'application/json',
			            'Content-type': 'application/json'
			        },
			        credentials: 'include',
			    }).then(response => {
			        if(response.status==200){
						window.location.href = "/home"
			        }else{
						console.log("failed to save user")
					}
			    	})		
				})
		    } else {
		    	aler("You must upload a profile picture.")
		    }
	    }else {
	    	if (validPswd && !validUsn){
	    		alert("Username already taken.")
	    	}
	    	if (validUsn && !validPswd){
	    		alert("Password must have a length of atleast 8")
	    	} else {
	    		alert("Try a different username and password [min length: 8]")
	    	}


	    }
	}
}




// check min length password
// check unique username
// check passwords match

// TODO: center field in sign up page