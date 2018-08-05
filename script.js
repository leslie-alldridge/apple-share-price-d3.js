const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=TE01GQSW0LFQBZIY';
 
//jQuery Ajax request 
jQuery.ajax({
    url: url,
    dataType: 'json',
    contentType: "application/json",
    success: function(data){
        var s = [];
        var parsedData = parseData(data);
        drawChart(parsedData);
      var closingPrice = []; 
        var timeSeriesData = data["Time Series (Daily)"]; 
        //console.log(timeSeriesData);
    for(var key in timeSeriesData){
    closingPrice.push({timeStamp : key, closingPrice : timeSeriesData[key]['4. close']}
    )}
    for (let i = 0; i < closingPrice.length; i++){
        s.push(closingPrice[i].closingPrice);
    }
    drawAgain(s, parsedData);
 }
});

// //parse data into key value pairs

function parseData(data) {
    var arr = [];
    for (var i in data["Time Series (Daily)"]) {
        arr.push({
            date: new Date(i), //date
            value: +data["Time Series (Daily)"][i]["4. close"] //convert string to number
        });
    }
    return arr;
}
//create chart using d3
function drawChart(data) {
    var svgWidth = 800, svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
        
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scaleTime()
        .rangeRound([0, width]);
    
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

        var focus = svg.append("g")                                // **********
    .style("display", "none"); 

        focus.append("circle")                                 // **********
        .attr("class", "y")                                // **********
        .style("fill", "none")                             // **********
        .style("stroke", "blue")                           // **********
        .attr("r", 4); 
    
    var line = d3.line()
        .x(function(d) { return x(d.date)})
        .y(function(d) { return y(d.value)})
        x.domain(d3.extent(data, function(d) { return d.date }));
        y.domain(d3.extent(data, function(d) { return d.value }));
    
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain");

    
    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($USD)");
    
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

var chart = $("#line-chart"),
    aspect = chart.width() / chart.height(),
    container = chart.parent();
$(window).on("resize", function() {
    var targetWidth = container.width();
    chart.attr("width", targetWidth);
    chart.attr("height", Math.round(targetWidth / aspect));
}).trigger("resize");

function drawAgain(s, parsedData) {
var ctx = document.getElementById("myChart").getContext('2d');
console.log(s.reverse());
var numberArray = [];
for (let i = 100; i >= 1; i--){
    numberArray.push(i);
}
console.log(numberArray.reverse());
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: numberArray,
        datasets: [{
            label: 'Apple Share Price Last 100 Days',
            data: s,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

}






