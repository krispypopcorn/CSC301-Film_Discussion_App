'use strict'
populateMovieTable();

/* Some Global variables and Movie Class */
let movieSet;
let confirmMovie;

class MovieElement {
	constructor(pic, name, date, num) {
		this.pic = pic
		this.name = name
		this. date = date
		this.num = num
	}
}

/* Getters for HTML elements */

const searchMovieButton = document.querySelector('#MovieDataForm')

const addMovieButton = document.querySelector('#addMovieButton')

const searchNewMovie = document.querySelector('#verifyMovie')

const movieDataTable = document.querySelector('#movieDataTable')

const formMovieAdd = document.querySelector('#addNewMovie')

const verifyMovieDelete = document.querySelector('#verifyMovieDelete')

const deleteMovieModal = document.querySelector('#deleteMovie')

const confirmDelete = document.querySelector('#deleteMovieButton')

const showAllMovies = document.querySelector('#showAllMovies')

/* Setting Event Listeners */

searchMovieButton.addEventListener('submit', QueryMovie)

searchNewMovie.addEventListener('click', verifyMovie)

formMovieAdd.addEventListener('click', openForm)

addMovieButton.addEventListener('click', addNewMovie)

verifyMovieDelete.addEventListener('click', verifyDelete)

deleteMovieModal.addEventListener('click', openDeleteForm)

confirmDelete.addEventListener('click', deleteMovieFromDatabase)

showAllMovies.addEventListener('click', allMovies)


/* Functions for Movie Table and options */

function openDeleteForm() {
	confirmDelete.disabled = 'true'
	const message = document.querySelector('#DeleteMessage')
	message.innerText = ""
	const placement = document.querySelector('#DeleteMovieImagePlace')
	if (placement.firstElementChild !== null) {
		placement.removeChild(placement.firstElementChild)
	}
}

function openForm() {
	addMovieButton.disabled = 'true'
	const placement = document.querySelector('#addMovieImagePlace')
	const addMessage = document.querySelector('#AddMovieMessage')
	const overview = document.querySelector('#addMovieOverview')
	overview.innerText = ""

	if (placement.firstElementChild !== null) {
		placement.removeChild(placement.firstElementChild)
	}
	addMessage.innerText = ""
}

function verifyMovie() {

	console.log('reached')
	
	// Get requested movie name
	const movieName = document.querySelector('#movieName').value
	const movieYear = document.querySelector('#movieYear').value
	const addMessage = document.querySelector('#AddMovieMessage')
	// console.log(`${movieName} ${movieYear}`)

	// Search, Save and get data from movie

	fetch(`/search/${movieName}/${movieYear}`).then(res => {
		return res.json()
	}).then(data => {
		const moviePoster = document.createElement('img')
		moviePoster.className = 'moviePosterVerify'
		moviePoster.setAttribute('src', data.banner)

		const placement = document.querySelector('#addMovieImagePlace')
		const overview = document.querySelector('#addMovieOverview')
		if (placement.firstElementChild !== null) {
			placement.removeChild(placement.firstElementChild)
		}

		overview.innerText = data.overview

		placement.appendChild(moviePoster)
		addMessage.style.color = "green"
		addMessage.innerText = "Add this movie to database?"
		addMovieButton.removeAttribute('disabled')
	}).catch((error) => {
		console.log(error)
	})

}

function addNewMovie() {

	const movieName = document.querySelector('#movieName').value
	const movieYear = document.querySelector('#movieYear').value
	
	fetch(`/movie/${movieName}/${movieYear}`).then(res => {
		return res.json()
	}).then((result) => {
		removeData(movieDataTable)
		populateMovieTable()
	})

}

function populateMovieTable() {

	let currentMovies;

	let tempMovieSet = []
	fetch('/findAllMovies').then(res => { 
  		return res.json()
	}).then(data=>{
		currentMovies = data;
		// console.log(currentMovies)
		for(let i = 0; i < currentMovies.length; i++) {
			fetch('/getMovieDisCount/'+currentMovies[i]._id).then(res=>{
				return res.json()})
				.then(num=>{
					let poster = currentMovies[i].poster
					let movieName = currentMovies[i].name
					let date = currentMovies[i].year
					let numDiscussions = num.value
					let newMovie = new MovieElement(poster, movieName, date, numDiscussions)
					tempMovieSet.push(newMovie)
					addToMovieTable(poster, movieName, date, numDiscussions);
					movieSet = tempMovieSet
				})
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

	let buttonData = document.createElement('td')
	let deleteButton = document.createElement('button')
	// deleteButton.className = 'deleteMovie'
	let deleteIcon = document.createElement('img')
	deleteIcon.setAttribute('src', '../Pictures/deleteIcon.png')
	deleteIcon.className = 'deleteMovie'
	deleteButton.appendChild(deleteIcon)
	deleteButton.style.visibility = "hidden"
	buttonData.appendChild(deleteButton)

	currentRow.appendChild(posterData)
	currentRow.appendChild(movieNameData)
	currentRow.appendChild(dateData)
	currentRow.appendChild(numDiscussionsData)
	currentRow.appendChild(buttonData)

	movieDataTable.appendChild(currentRow)
}

function verifyDelete() {

	const movieToDelete = document.querySelector('#MovieToDelete').value

	const movieLower = movieToDelete.toLowerCase()

	for (let i = 0; i < movieSet.length; i++) {
		let currentMovie = movieSet[i]

		let movieNameLower = currentMovie.name.toLowerCase()

		if (movieNameLower.includes(movieLower)) {
			confirmMovie = currentMovie.name
			break
		}
	}

	const message = document.querySelector('#DeleteMessage')
	message.style.color = "red"

	fetch(`/search/${confirmMovie}`).then((result) => {
		// console.log(result)
		return result.json()
	}).then((data) => {
		if (data.name !== "NOT FOUND") {
			const moviePoster = document.createElement('img')
			moviePoster.className = 'moviePosterVerify'
			moviePoster.setAttribute('src', data.poster)

			const placement = document.querySelector('#DeleteMovieImagePlace')
			if (placement.firstElementChild !== null) {
				placement.removeChild(placement.firstElementChild)
			}
			placement.appendChild(moviePoster)
			confirmDelete.removeAttribute('disabled')

			message.innerText = "Are you sure you want to delete this movie?"
		} else {
			message.innerText = "Movie not found, re-define search"
		}
	})

}

function deleteMovieFromDatabase() {

	const url = `/search/${confirmMovie}`

	const request = new Request(url , {
		method: 'delete'
	});

	fetch(request).then((res) => {
		if(res.status === 200) {
			removeData(movieDataTable)
			populateMovieTable()
		}
	})

}

function QueryMovie(e) {


	e.preventDefault()
	removeData(movieDataTable)
	let flag = 0;
	let error = document.querySelector("#movieSearchError")
	error.innerText = ""
	let movieToSearch = document.querySelector('#MovieQuerySearch').value

	const lowerSearch = movieToSearch.toLowerCase()

	for (let i = 0; i < movieSet.length; i++) {
		let currentMovie = movieSet[i]
		let currentMovieName = movieSet[i].name.toLowerCase()

		if (currentMovieName.includes(lowerSearch)) {
			flag = 1;
			addToMovieTable(currentMovie.pic, currentMovie.name, currentMovie.date, currentMovie.num)
		}

	}

	if (flag === 0) {
		// dataTable.appendChild(document.createTextNode("Username not found"));
		
		error.innerText = "Movie not found"
	}
}

function allMovies() {

	removeData(movieDataTable)
	let error = document.querySelector("#movieSearchError")
	error.innerText = ""

	for(let i = 0; i < movieSet.length; i++) {
		let currentMovie = movieSet[i]
		addToMovieTable(currentMovie.pic, currentMovie.name, 
			currentMovie.date, currentMovie.num)
	}


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