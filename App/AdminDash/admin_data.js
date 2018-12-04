// Getting reference to relavant DOM elements
"use strict"
const domain = "http://localhost:8000"

let confirmUser 

let imgUrl

const log = console.log

populateUserTable()

/* Getters for HTML elements */

const searchButton = document.querySelector('#dataForm');

const showAllButton = document.querySelector('#showAllQuery');

const dataTable = document.querySelector("#dataTable");

const saveButton = document.querySelector("#SaveButton")

const verifyUserDelete = document.querySelector("#verifyUserDelete")

const confirmUserDelete = document.querySelector("#deleteUserButton")

const deleteUserModel = document.querySelector("#deleteUser")

const addUserModel = document.querySelector('#AddUser')

const addUserButton = document.querySelector('#addUserButton')

const verifyUser = document.querySelector('#verifyUser')


/* User Class */

class User {
	constructor(image, username, like, dbId) {
		this.image = image;
		this.username = username;
		this.like = like;
		this.dbId = dbId
	}
}

let userSet
// console.log("pressed")

// Entering dummy userSet data
// would normally pull data from the database

// userSet.push(new User("../Pictures/icon.jpg", "Jennifer", 21))
// userSet.push(new User("../Pictures/me.png", "Faiyaz", 54))
// userSet.push(new User("../Pictures/icon.jpg", "Jane", 12))
// userSet.push(new User("../Pictures/icon.jpg", "Fionna", 68))


showAllButton.addEventListener('click', showAllData)

searchButton.addEventListener('submit', showSelected)

dataTable.addEventListener('click', editUserOrDelete)

saveButton.addEventListener('click', saveUser)

deleteUserModel.addEventListener('click', openDeleteModel)

verifyUserDelete.addEventListener('click', verifyDelete)

confirmUserDelete.addEventListener('click', confirmDeleteUser)

addUserModel.addEventListener('click', openAddModel)

verifyUser.addEventListener('click', verifyUserDB)

addUserButton.addEventListener('click', confirmAddUser)



/* User Specific Funtions */

function openAddModel() {

	addUserButton.disabled = 'true'
	const message = document.querySelector('#AddUserMessage')
	message.innerText = ""

}

function openDeleteModel() {

	log("Reached")
	confirmUserDelete.disabled = 'true'
	const message = document.querySelector('#DeleteUserMessage')
	message.innerText = ""
	const placement = document.querySelector('#DeleteUserImagePlace')
	if (placement.firstElementChild !== null) {
		placement.removeChild(placement.firstElementChild)
	}
}

function verifyUserDB() {

	const userToAdd = document.querySelector('#username').value

	const password = document.querySelector('#password').value

	// const icon = document.querySelector('#icon').value

	const message = document.querySelector('#AddUserMessage')

	/* Check if there is an existing user */
	const userlower = userToAdd.toLowerCase()
	for(let i = 0; i < userSet.length; i++) {

		let userSetLower = userSet[i].username.toLowerCase()
		if (userlower === userSetLower) {
			message.style.color = "red"
			message.innerText = "User already exists!"
			return;
		}
	}

	if (password.length === 0) {
		message.style.color = "red"
		message.innerText = "Password cannot be empty!"
		return;
	}

	message.style.color = "green"
	message.innerText = "Verification Passed, Click Add User to confirm"
	addUserButton.removeAttribute('disabled')

}


function confirmAddUser() {

	const userToAdd = document.querySelector('#username').value

	const password = document.querySelector('#password').value

	// const icon = document.querySelector('#icon').value	

	const url = `/adminCreateUser`

	const data = {
		"username": userToAdd,
		"password": password,
		"icon": "http://res.cloudinary.com/dxpmsmv08/image/upload/v1543793099/demo/q4cwstmcppyuy0xyxdgd.png"
	}
	// const request = new Request(url, {
	// 	method: 'PATCH',
	// 	body: JSON.stringify(data)
	// });

	// log(request)

	fetch(url, {
		method: 'POST', 
		body: JSON.stringify(data), 
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json'
		},
		credentials: 'include',
	  }).then((response) => {
		removeData(dataTable)
		populateUserTable()
	}).catch((error) => {
		log(error)
	})


}


function verifyDelete() {

	const userToDelete = document.querySelector('#UserToDelete').value

	const userLower = userToDelete.toLowerCase()

	for (let i = 0; i < userSet.length; i++) {

		let currentUser = userSet[i]

		let currentUserLower = currentUser.username.toLowerCase()

		if (currentUserLower.includes(userLower)) {

			confirmUser = currentUser.dbId
			break;

		}
	}

	const message = document.querySelector('#DeleteUserMessage')
	message.style.color = "red"

	fetch(`/searchUser/${confirmUser}`).then((result) => {
		return result.json()
	}).then((data) => {

		if (data.status === 404) {
			message.innerText = "User Not Found"
		} else {
			const userIcon = document.createElement('img')
			userIcon.className = 'moviePosterVerify'
			userIcon.setAttribute('src', data.icon)

			const placement = document.querySelector('#DeleteUserImagePlace')
			if (placement.firstElementChild !== null) {
				placement.removeChild(placement.firstElementChild)
			}
			placement.appendChild(userIcon)
			confirmUserDelete.removeAttribute('disabled')
			message.innerText = "Are you sure you want to delete this user?"

		}

	})

}

function confirmDeleteUser() {

	log(confirmUser)
	const url = `/deleteFinal/${confirmUser}`

	const request = new Request(url, {
		method: 'delete'
	});

	fetch(request).then((res) => {
		if (res.status === 205) {
			removeData(dataTable)
			populateUserTable()
		}
	})


}




function populateUserTable() {
	
	let tempUsers = []

	fetch(`/allUsers`).then((res) => {
		return res.json()
	}).then((data) => {
		// log(data)
		let currentUsers = data

		for (let i = 0; i < currentUsers.length; i++) {
			// log(currentUsers[i])
			let name = currentUsers[i].username
			let image = currentUsers[i].icon
			// let discussions = currentUsers[i].discussions.length
			let like = currentUsers[i].like
			let dbId = currentUsers[i]._id
			// log(dbId)
			let newUser = new User(image,name,like, dbId)
			tempUsers.push(newUser)
			createDataRow(newUser)
		}

		userSet = tempUsers
	}).catch((error) => {
		log(error)
	})
}


function saveUser(e) {

	let currentUser = document.querySelector('#editTitle').innerText
	let userToModify;

	for (let i = 0; i < userSet.length; i++) {
		if (userSet[i].username === currentUser) {
			userToModify = userSet[i]
			break;
		}
	}

	// Get new username

	let newUserName = document.querySelector('#editUsername').value
	let newUserPassword = document.querySelector("#editPassword").value
	// userToModify.username = newUserName;
	const url = `/modifyUserName/${userToModify.dbId}`
	log(newUserName)

	const data = {
		"username": newUserName,
		"password": newUserPassword
	}
	// const request = new Request(url, {
	// 	method: 'PATCH',
	// 	body: JSON.stringify(data)
	// });

	// log(request)

	fetch(url, {
		method: 'PATCH', 
		body: JSON.stringify(data), 
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json'
		},
		credentials: 'include',
	  }).then((response) => {
		removeData(dataTable)
		populateUserTable()
	}).catch((error) => {
		log(error)
	})
	// Would also modify the password in this function 


}

function editUser(e) {

	let targetRow = e.target.parentElement.parentElement
	let usernameForm = document.querySelector('#editUsername')
	let name = targetRow.firstElementChild.nextElementSibling.innerText
	usernameForm.setAttribute("placeholder", name)

	let title = document.querySelector("#editTitle")
	title.innerText = name;

	//Will pull user password from the database

	let passwordForm = document.querySelector("#editPassword")
	passwordForm.setAttribute("placeholder", "UserPassword")
}



function deleteUser(e) {

	// Dom manipulation to delete user

	e.preventDefault()
	let targetRow = e.target.parentElement.parentElement.parentElement
	dataTable.removeChild(targetRow);


	// Would delete user from the database server as well

}


function editUserOrDelete(e) {
	if (e.target.classList.contains('edit')) {

		editUser(e);

	}
	if (e.target.classList.contains('delete')) {

		deleteUser(e);

	}
}


function showSelected(e) {

	e.preventDefault();
	removeData(dataTable);
	let nameToSearch = document.querySelector("#filterSearch").value;
	let lowerCase = nameToSearch.toLowerCase()

	let flag = 0;

	for (let i = 0; i < userSet.length; i++) {
		let currentUser = userSet[i]

		let userNameLower = currentUser.username.toLowerCase()

		if (userNameLower.includes(lowerCase)) {
			flag = 1;
			createDataRow(currentUser)
		}

	}

	if (flag === 0) {
		// dataTable.appendChild(document.createTextNode("Username not found"));
		let error = document.querySelector(".searchError")
		error.innerText = "Username not found"
	}


}

function showAllData(e) {

	e.preventDefault()
	// console.log("pressed")

	removeData(dataTable);
	addAvailableData();

}

function removeData(table) {

	let resetError = document.querySelector(".searchError")
	resetError.innerText = ""

	let currentRow = table.firstElementChild

	while (currentRow !== null) {
		let temp = currentRow.nextElementSibling
		console.log()
		table.removeChild(currentRow)
		currentRow = temp
	}
}

function addAvailableData() {

	for (let i = 0; i < userSet.length; i++) {

		let currentUser = userSet[i];
		createDataRow(currentUser)
	}
}


function createDataRow(currentUser) {

	let newRow = document.createElement('tr')

	let dataTh = document.createElement('th')
	dataTh.setAttribute("scope", "row")
	let img = document.createElement('img')
	img.className = "icons"
	img.setAttribute("src", currentUser.image)
	dataTh.appendChild(img)

	let dataName = document.createElement('td')
	dataName.innerText = currentUser.username

	let dataPost = document.createElement('td')
	dataPost.innerText = currentUser.like

	let options = document.createElement('td')

	let editButton = document.createElement('button')
	editButton.className = "btn btn-outline-success my-2 ml-sm-2 edit"
	editButton.setAttribute("data-toggle", "modal")
	editButton.setAttribute("data-target", "#EditUserModal")
	editButton.innerText = "Edit User"
	options.appendChild(editButton);

	newRow.appendChild(dataTh)
	newRow.appendChild(dataName)
	newRow.appendChild(dataPost)
	newRow.appendChild(options)

	// return newRow;
	dataTable.appendChild(newRow)
}

