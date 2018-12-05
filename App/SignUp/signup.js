$("#sign_up_btn").on('click',InputCheck);


const userUrl = '/createUser';



function InputCheck(e){
	e.preventDefault();
    const username = $('#username').val();
	const password = $('#password').val();
	const files = document.querySelector('[type=file]').files;
	const formData = new FormData();
	formData.append('photo',files[0]);
	const confirmpassword = $('#confirm_password').val();
	if(username==''){
		popUP('Username cannot be empty')
        return 0
	}
	if(password.length<8){
		popUP('Password must have a length of at least 8')
        return 0
	}
	if(password != confirmpassword){
		popUP('Password does not match the confirm password')
        return 0
	}
	if(files.length==0){
		popUP('Please upload an icon')
        return 0
	}
	fetch('/userExist/'+username)
    .then(response => {
        return response.json()
    }).then(json =>{
        if(json == true){
            popUP('Username already taken.')
        }else if(json == false){
            createUser(formData)
        }
    })
}

function createUser(formData){
    const username = $('#username').val();
    const password = $('#password').val();
	fetch('/uploadImg', {
		method: 'POST',
		body: formData,
	}).then(response => {
		return response.json()
	}).then(url=>{
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
			popUP("failed to save user")
		}
	})		
})
}
