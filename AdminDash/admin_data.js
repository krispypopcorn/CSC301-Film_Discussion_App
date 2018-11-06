const searchButton = document.querySelector('#dataForm');

const showAllButton = document.querySelector('#showAllQuery');

const dataTable = document.querySelector("#dataTable");

class User {
	constructor(image, username, numPost) {
		this.image = image;
		this.username = username;
		this.numPost = numPost;
	}
}

let userSet = []
// console.log("pressed")

//Entering dummy userSet data
// would normally pull data from the database

userSet.push(new User("../Pictures/icon.jpg", "Jennifer", 21))
userSet.push(new User("../Pictures/me.png", "Faiyaz", 54))
userSet.push(new User("../Pictures/icon.jpg", "Jane", 12))
userSet.push(new User("../Pictures/icon.jpg", "Fionna", 68))


showAllButton.addEventListener('click', showAllData)

searchButton.addEventListener('submit', showSelected)

dataTable.addEventListener('click', editUser)


function editUser(e) {
	if (e.target.classList.contains('edit')) {


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
}


function showSelected(e) {

	e.preventDefault();
	removeData();
	let nameToSearch = document.querySelector("#filterSearch").value;
	let flag = 0;

	for (let i = 0; i < userSet.length; i++) {
		currentUser = userSet[i]

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

	removeData();
	addAvailableData();

}

function removeData() {

	let resetError = document.querySelector(".searchError")
	resetError.innerText = ""

	let currentRow = dataTable.firstElementChild

	while (currentRow !== null) {
		temp = currentRow.nextElementSibling
		console.log()
		dataTable.removeChild(currentRow)
		currentRow = temp
	}
}

function addAvailableData() {

	for (let i = 0; i < userSet.length; i++) {

		currentUser = userSet[i];
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
	deleteImg.className = "icons"
	deleteImg.setAttribute("src", "../Pictures/deleteIcon.png")
	deleteIcon.appendChild(deleteImg)
	options.appendChild(deleteIcon)

	let editButton = document.createElement('button')
	editButton.className = "btn btn-outline-success my-2 ml-sm-2 edit"
	editButton.setAttribute("data-toggle", "modal")
	editButton.setAttribute("data-target", "#exampleModal")
	editButton.innerText = "Edit User"
	options.appendChild(editButton);

	newRow.appendChild(dataTh)
	newRow.appendChild(dataName)
	newRow.appendChild(dataPost)
	newRow.appendChild(options)

	return newRow;

}

