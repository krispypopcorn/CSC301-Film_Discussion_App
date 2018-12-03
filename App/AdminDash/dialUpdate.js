"use strict"

// const domain = "http://localhost:8000"

const userDial = document.querySelector("#totalUsers")

const filmDial = document.querySelector("#totalFilms")

const PostDial = document.querySelector("#totalPosts")

const CommentDial = document.querySelector("#totalComments")

updateDials()

// On start up, webpage will query database and get relavant dial numbers

function updateDials() {

	updateUser()

	updateFilm()

	updatePost()

	updateComment()

}

// All of these pull data from database and change innerText value

function updateUser() {

	fetch("http://localhost:8000/userCount").then ((result) => {
		return result.json()
	}).then((data) => {
		userDial.innerText = data.value
	}).catch((error) => {
		console.log(error)
	})

}

function updateFilm() {

	fetch("http://localhost:8000/getMovieCount").then((result) => {
		return result.json()
	}).then((data) => {
		filmDial.innerText = data.value
	}).catch((error)=> {
		console.log(error)
	})
}

function updatePost() {

	fetch("http://localhost:8000/getDiscussionCount").then((result) => {
		return result.json()
	}).then((data) => {
		PostDial.innerText = data.value
	}).catch((error)=> {
		console.log(error)
	})
}

function updateComment() {

	
}