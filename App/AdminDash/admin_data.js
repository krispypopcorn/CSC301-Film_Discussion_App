// Getting reference to relavant DOM elements
"use strict"

const searchButton = document.querySelector('#dataForm');

const showAllButton = document.querySelector('#showAllQuery');

const dataTable = document.querySelector("#dataTable");

const saveButton = document.querySelector("#SaveButton")

const addMovieButton = document.querySelector('#addMovieButton')

const searchNewMovie = document.querySelector('#verifyMovie')

const movieDataTable = document.querySelector('#movieDataTable')

const formMovieAdd = document.querySelector('#addNewMovie')

class User {
	constructor(image, username, numPost) {
		this.image = image;
		this.username = username;
		this.numPost = numPost;
	}
}

let userSet = []
// console.log("pressed")

// Entering dummy userSet data
// would normally pull data from the database

userSet.push(new User("../Pictures/icon.jpg", "Jennifer", 21))
userSet.push(new User("../Pictures/me.png", "Faiyaz", 54))
userSet.push(new User("../Pictures/icon.jpg", "Jane", 12))
userSet.push(new User("../Pictures/icon.jpg", "Fionna", 68))


showAllButton.addEventListener('click', showAllData)

searchButton.addEventListener('submit', showSelected)

dataTable.addEventListener('click', editUserOrDelete)

saveButton.addEventListener('click', saveUser)

searchNewMovie.addEventListener('click', verifyMovie)

formMovieAdd.addEventListener('click', openForm)


addMovieButton.addEventListener('click', addNewMovie)


/* Populating movieDataTable with existing movies in 
	database 	*/
populateMovieTable();

function openForm() {
	addMovieButton.disabled = 'true'
}

function verifyMovie() {

	console.log('reached')
	
	// Get requested movie name
	const movieName = document.querySelector('#movieName').value
	const movieYear = document.querySelector('#movieYear').value
	// console.log(`${movieName} ${movieYear}`)

	// Search, Save and get data from movie

	fetch(`http://localhost:8000/search/${movieName}/${movieYear}`).then(res => {
		return res.json()
	}).then(data => {
		const moviePoster = document.createElement('img')
		moviePoster.className = 'moviePoster'
		moviePoster.setAttribute('src', data.poster)

		const placement = document.querySelector('#addMovieImagePlace')
		if (placement.firstElementChild !== null) {
			placement.removeChild(placement.firstElementChild)
		}
		placement.appendChild(moviePoster)
		addMovieButton.removeAttribute('disabled')
	}).catch((error) => {
		console.log(error)
	})

}

function addNewMovie() {

	const movieName = document.querySelector('#movieName').value
	const movieYear = document.querySelector('#movieYear').value
	
	fetch(`http://localhost:8000/movie/${movieName}/${movieYear}`).then(res => {
		return res.json()
	}).then((result) => {
		removeData(movieDataTable)
		populateMovieTable()
	})

}




function populateMovieTable() {

	let currentMovies;
	
	fetch('http://localhost:8000/findAllMovies').then(res => { 
  		return res.json()
	}).then(data=>{
		currentMovies = data;
		// console.log(currentMovies)
		for(let i = 0; i < currentMovies.length; i++) {

			let poster = currentMovies[i].poster
			let movieName = currentMovies[i].name
			let date = currentMovies[i].year
			let numDiscussions = currentMovies[i].numOfDiscussions
			addToMovieTable(poster, movieName, date, numDiscussions);
		}

	})
}

function addToMovieTable(poster, movieName, date, numDiscussions) {

	let currentRow = document.createElement('tr')

	let posterData = document.createElement('th')
	let posterImage = document.createElement('img')
	posterImage.setAttribute('src', poster)
	posterImage.className = "moviePoster";
	posterData.appendChild(posterImage)

	let movieNameData = document.createElement('td')
	movieNameData.appendChild(document.createTextNode(movieName))

	let dateData = document.createElement('td')
	dateData.appendChild(document.createTextNode(date))

	let numDiscussionsData = document.createElement('td')
	numDiscussionsData.appendChild(document.createTextNode(numDiscussions))

	currentRow.appendChild(posterData)
	currentRow.appendChild(movieNameData)
	currentRow.appendChild(dateData)
	currentRow.appendChild(numDiscussionsData)

	movieDataTable.appendChild(currentRow)


}


function saveUser(e) {

	// console.log('Clicked')
	// Get User to modify data

	let currentUser = document.querySelector('#editTitle').innerText
	let userToModify;

	// Would normally do a database call

	for (let i = 0; i < userSet.length; i++) {
		if (userSet[i].username === currentUser) {
			userToModify = userSet[i]
			break;
		}
	}

	// Get new username

	let newUserName = document.querySelector('#editUsername').value
	userToModify.username = newUserName;

	removeData(dataTable)
	addAvailableData()

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
	let flag = 0;

	for (let i = 0; i < userSet.length; i++) {
		let currentUser = userSet[i]

		if (currentUser.username === nameToSearch) {
			flag = 1;
			let newRow = createDataRow(currentUser)
			dataTable.appendChild(newRow)
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
		let newRow = createDataRow(currentUser)
		dataTable.appendChild(newRow);
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
	dataPost.innerText = currentUser.numPost

	let options = document.createElement('td')
	let deleteIcon = document.createElement('a')
	deleteIcon.href = "#"
	let deleteImg = document.createElement('img')
	deleteImg.className = "delete"
	deleteImg.setAttribute("src", "../Pictures/deleteIcon.png")
	deleteIcon.appendChild(deleteImg)
	options.appendChild(deleteIcon)

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

	return newRow;

}

