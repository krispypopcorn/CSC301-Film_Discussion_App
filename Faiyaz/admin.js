google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
function drawChart() {
  var data = google.visualization.arrayToDataTable([
  ['Genre', 'Hours per Day'],
  ['Horror', 45],
  ['Fantasy',23],
  ['Comedy', 67],
  ['Romance', 24],
  ['Thriller', 67]
]);

  // Optional; add a title and set the width and height of the chart
  var options = {'title':'Average Viewing Genre', 'width':550, 'height':400};

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}