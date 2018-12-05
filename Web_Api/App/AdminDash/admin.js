"use strict";

//Add event-listner
$("#profilePic").on('click', function(event) {window.location.href = "/profilePage";});
$("#homeLink").on('click', function(event) {console.log("HI");window.location.href = "/home";});
$("#adminLink").on('click', function(event) {window.location.href = "/adminDash";});
$("#signOut").on('click', function(event) {window.location.href = "/logout";});

setUserIcon()
populateMovieSet()

// google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChartView);
// google.charts.setOnLoadCallback(drawChartUser);

class Movie {
	constructor(name, numDiscussions) {
    this.name = name
    this.numDiscussions = numDiscussions
	}
}

let movieDiscussionSet;

function populateMovieSet() {

  let currentMovies;

	let tempMovieSet = [['Movie Name', 'Number of Discussions']]
	fetch('/findAllMovies').then(res => { 
  		return res.json()
	}).then(data=>{
		currentMovies = data;
		// console.log(currentMovies)
		for(let i = 0; i < currentMovies.length; i++) {
			fetch('/getMovieDisCount/'+currentMovies[i]._id).then(res=>{
				return res.json()})
				.then(num=>{
					let movieName = currentMovies[i].name
          let numDiscussions = num.value
          if (numDiscussions > 0) {
					  // let newMovie = new Movie(movieName, numDiscussions)
            // tempMovieSet.push(newMovie)
            let toAdd = []
            toAdd.push(movieName)
            toAdd.push(numDiscussions)
            tempMovieSet.push(toAdd)
          }
					
				})
    }
    movieDiscussionSet = tempMovieSet
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChartView);
	})
}

// Draw the chart and set the chart values
// Will pull chart value count from database
function drawChartView() {

  console.log(movieDiscussionSet)
  var data = google.visualization.arrayToDataTable(movieDiscussionSet);

  // Optional; add a title and set the width and height of the chart
  var options = {'width':500,
                'legend':'left',
                'titleTextStyle': {'color': '#FAFAFA', 'fontSize': 30, 'fontName': "'Quicksand', sans-serif"},
                'title': 'Popular Discussions',
                'height':400,
                'is3D': true,
                'backgroundColor': { 'fill':'transparent' }, 
                'legendTextStyle': { 'color': '#FAFAFA', 'fontName': "'Quicksand', sans-serif", 'fontSize': 15}          
              };

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechartV'));
  chart.draw(data, options);
}
