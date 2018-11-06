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

userSet.push(new User("icon.jpg", "Jennifer", 21))
userSet.push(new User("me.png", "Faiyaz", 54))
userSet.push(new User("icon.jpg", "Jane", 12))
userSet.push(new User("icon.jpg", "Fionna", 68))


showAllButton.addEventListener('click', showAllData)

searchButton.addEventListener('submit', showSelected)

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
	console.log(currentRow);

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
	deleteImg.setAttribute("src", "deleteIcon.png")
	deleteIcon.appendChild(deleteImg)
	options.appendChild(deleteIcon)

	let GearIcon = document.createElement('a')
	GearIcon.href = "#"
	let GearImg = document.createElement('img')
	GearImg.className = "icons"
	GearImg.setAttribute("src", "gear.jpg")
	GearIcon.appendChild(GearImg)
	options.appendChild(GearIcon)	

	newRow.appendChild(dataTh)
	newRow.appendChild(dataName)
	newRow.appendChild(dataPost)
	newRow.appendChild(options)

	return newRow;

}

