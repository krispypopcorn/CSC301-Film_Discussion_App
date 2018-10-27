google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChartView);
google.charts.setOnLoadCallback(drawChartUser);

// Draw the chart and set the chart values
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
                'titleTextStyle': {'color': '#FAFAFA', 'fontSize': 20},
                'title': 'Average Viewing Genre',
                'height':400,
                'is3D': true,
                'backgroundColor': '#171718', 
                'legendTextStyle': { 'color': '#FAFAFA' }          
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
  ['Fionna', 68]
]);

  // Optional; add a title and set the width and height of the chart
  var options = {'width':500,
                'legend':'left',
                'titleTextStyle': {'color': '#FAFAFA', 'fontSize': 20},
                'title': 'Top Contributers',
                'height':400,
                'is3D': true,
                'backgroundColor': '#171718', 
                'legendTextStyle': { 'color': '#FAFAFA' }          
              };

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechartU'));
  chart.draw(data, options);
}