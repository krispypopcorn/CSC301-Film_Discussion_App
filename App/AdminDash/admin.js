"use strict";

//Add event-listner
$("#profilePic").on('click', function(event) {window.location.href = "../UserProfile/user_profile.html" + "?para1="+ permission;});
$("#homeLink").on('click', function(event) {console.log("HI");window.location.href = "../Homepage/homepage.html" + "?para1="+ permission;});
$("#adminLink").on('click', function(event) {window.location.href = "../AdminDash/admin.html" + "?para1="+ permission;});
$("#signOut").on('click', function(event) {window.location.href = "../Login/index.html";});

/*----navigate to another page----*/
// you need to pass your permission to the next page
// window.location.href = "../UserProfile/user_profile.html" + "?para1="+ permission
/*----navigate to another page----*/


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChartView);
google.charts.setOnLoadCallback(drawChartUser);

// Draw the chart and set the chart values
// Will pull chart value count from database
function drawChartView() {
  var data = google.visualization.arrayToDataTable([
  ['Genre', 'Hours per Day'],
  ['Horror', 45],
  ['Fantasy',23],
  ['Comedy', 67],
  ['Romance', 24],
  ['Thriller', 67]
]);

  // Optional; add a title and set the width and height of the chart
  var options = {'width':500,
                'legend':'left',
                'titleTextStyle': {'color': '#FAFAFA', 'fontSize': 30, 'fontName': "'Quicksand', sans-serif"},
                'title': 'Genre Stats',
                'height':400,
                'is3D': true,
                'backgroundColor': { 'fill':'transparent' }, 
                'legendTextStyle': { 'color': '#FAFAFA', 'fontName': "'Quicksand', sans-serif", 'fontSize': 15}          
              };

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechartV'));
  chart.draw(data, options);
}

function drawChartUser() {
  var data = google.visualization.arrayToDataTable([
  ['Username', 'Post'],
  ['Jennifer', 21],
  ['Faiyaz',54],
  ['Jane', 12],
  ['Fionna', 68],
  ['Others', 75]
]);

  // Optional; add a title and set the width and height of the chart
  var options = {'width':500,
                'legend':'left',
                'titleTextStyle': {'color': '#FAFAFA', 'fontSize': 30, 'fontName': "'Quicksand', sans-serif"},
                'title': 'Top Contributers',
                'height':400,
                'is3D': true,
                'backgroundColor': { 'fill':'transparent' }, 
                'legendTextStyle': { 'color': '#FAFAFA', 'fontName': "'Quicksand', sans-serif", 'fontSize': 15 }          
              };

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechartU'));
  chart.draw(data, options);
}