const searchButton = document.querySelector('#searchQuery');

const showAllButton = document.querySelector('#showAllQuery');

class User {
	constructor(image, username, numPost) {
		this.image = image;
		this.username = username;
		this.numPost = numPost;
	}
}

let userSet = []

//Entering dummy userSet data

userSet.push(new User("icon.jpg", "Jennifer", 21))
userSet.push(new User("me.png", "Faiyaz", 54))
userSet.push(new User("icon.jpg", "Jane", 12))
userSet.push(new User("icon.jpg", "Fionna", 68))


showAllQuery.addEventListener('submit', showAllData)

// searchButton.addEventListener('submit', showSelected)

function showAllData(e) {

	e.preventDefault()

	removeData();

}

function removeData() {

	const dataTable = document.querySelector("#dataTable");

	let currentRow = dataTable.firstElementChild

	while (currentRow !== null) {
		temp = currentRow.nextElementSibling
		console.log()
		dataTable.removeChild(currentRow)
		currentRow = temp
	}
}

