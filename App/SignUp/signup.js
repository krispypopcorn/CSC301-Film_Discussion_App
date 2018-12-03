$("#sign_up_btn").on('click',createUser);


const userUrl = '/createUser';


function createUser(e){
	e.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
	const confirmpassword = $('#confirm_password').val();
	

    if(password == confirmpassword){
    	console.log("confirmpassword");

       const files = document.querySelector('[type=file]').files;
	   const formData = new FormData();
	   formData.append('photo',files[0]);
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
		}
	)}
}




// check min length password
// check unique username
// check passwords match

// TODO: center field in sign up page