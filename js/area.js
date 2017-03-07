
function area() {
    var colors = d3.scaleOrdinal(d3.schemeCategory20b);
    var areaDiv = $("#area");

    for (var i = 0; i < 20; i++) {
        colors(i);
    };

    /*var margin = {top: 20, right: 20, bottom: 90, left: 50},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;*/

    var margin = {top: 100, right: 40, bottom: 100, left: 40},
        width = areaDiv.width() - margin.left - margin.right,
        height = areaDiv.height() - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%Y");

    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

    // gridlines in x axis function
    function make_x_gridlines() {       
        return d3.axisBottom(x)
            .ticks(5)
    }
    // gridlines in y axis function
    function make_y_gridlines() {       
        return d3.axisLeft(y)
            .ticks(5)
    }

    var xAxis = d3.axisBottom(x);//.tickSize(0),
        yAxis = d3.axisLeft(y);//.tickSize(0);

    var brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("brush", brushed);

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var svg = d3.select("#area").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);


    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var barChart = svg.append("g")
        .attr("class", "barChart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Data Load from CSV
    d3.csv("data/movies.csv", function(error, data) {
        if(error) throw error;
        /*data.forEach(function(d) {
            d.year = parseTime(d.year);
        });*/


        var bechdel = [];
        var years = [];

        for (var i = 0; i < data.length; i++) {
            if (years.indexOf(data[i]["year"]) < 0) {
                    var newYear = {
                        year : data[i]["year"],
                        passed : 0,
                        failed : 0
                    };

                    bechdel.push(newYear);
                    years.push(data[i]["year"]);
                }
            if (data[i]["binary"] == "PASS") {
                bechdel.forEach( function(d) {
                    if (d["year"] == data[i]["year"]) {
                        d["passed"] += 1;
                    }
                });
            }
            else {
                bechdel.forEach( function(d) {
                    if (d["year"] == data[i]["year"]) {
                        d["failed"] += 1;
                    }
                });
            }
            
        };

        console.log(bechdel);


        /*passed_films.forEach(function(d) {
            d.year = parseTime(d.year);
        });
        failed_films.forEach(function(d) {
            d.year = parseTime(d.year);
        }); */

        var xMin = d3.min(bechdel, function(d) { return parseTime(d.year); });
        var xMax = d3.max(bechdel, function(d) { return parseTime(d.year); });

        var yMax = Math.max(20, d3.max(bechdel, function(d) { return d.passed; }));
        yMax = Math.max(yMax, d3.max(bechdel, function(d) { return d.failed; }));

        x.domain([d3.timeYear.offset(xMin,-1), d3.timeYear.offset(xMax,1)]);
        y.domain([0, yMax]);


        // add the X gridlines
        /*svg.append("g")           
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )*/
        /*svg.append("g")           
            .attr("class", "grid")
            //.attr("transform", "translate(100," + height + ")")
            .call(xAxis.ticks(5).tickSize(-height).tickFormat(""))*/
        /*// add the Y gridlines
        svg.append("g")           
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )*/

        
        /*barChart.append("g")
            .attr("class", "stuff")
            .call(yAxis.ticks(5).tickSize(-width).tickFormat(""));*/
        

        var rect_width = width/88 - 2;
        var rect_width2 = width/44;
        var rect_height = y(yMax);



        var movies = barChart.append("g");

        movies.attr("clip-path", "url(#clip)");
        movies.selectAll("movie_bar")
            .data(bechdel)
            .enter().append("rect")
            .attr('class', 'movie_bar')
            .attr("fill", function(d) {
                var rate = d.passed/(d.passed+d.failed);
                if (rate > 0.75) { 
                    return colors(4);
                }
                else if (rate > 0.5) {
                    return colors(5);
                }
                else if (rate < 0.25) {
                    return colors(14);
                }
                else if (rate < 0.5) {
                    return colors(15);
                }
                else {
                    return colors(10);
                }
            })
            .attr("opacity", 0.1)
            .attr("x", function(d) { return x(parseTime(d.year))-rect_width2/2; })
            .attr("y", y(yMax))
            .attr("width", rect_width2)
            .attr("height",height)
            .on("mouseover", function(d) {      
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                div .html(d.year + "<br/>" + "Passed: " + d.passed + "<br/>Failed: " + d.failed)  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 42) + "px");    
                })                  
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            });

        movies.attr("clip-path", "url(#clip)");
        movies.selectAll("passed_bar")
            .data(bechdel)
            .enter().append("rect")
            .attr('class', 'passed_bar')
            .attr("fill", colors(5))
            //.attr("opacity", 0.8)
            .attr("x", function(d) { return x(parseTime(d.year)) - rect_width; })
            .attr("y", function(d) { return y(d.passed); })
            .attr("width", rect_width)
            .attr("height",function(d) { return height - y(d.passed); })
            .on("mouseover", function(d) {      
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                div .html(d.year + "<br/>" + "Passed: " + d.passed + "<br/>Failed: " + d.failed)  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 42) + "px");    
                })                  
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            });
            

        movies.attr("clip-path", "url(#clip)");
        movies.selectAll("failed_bar")
            .data(bechdel)
            .enter().append("rect")
            .attr('class', 'failed_bar')
            .attr("fill", colors(13))
            //.attr("opacity", 0.8)
            .attr("x", function(d) { return x(parseTime(d.year)); })
            .attr("y", function(d) { return y(d.failed); })
            .attr("width", rect_width)
            .attr("height",function(d) { return y(0) - y(d.failed); })
            .on("mouseover", function(d) {      
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                div .html(d.year + "<br/>" + "Passed: " + d.passed + "<br/>Failed: " + d.failed)  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 42) + "px");    
                })                  
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            });
        
        
        
        barChart.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        
        barChart.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis)
            //.call(yAxis.ticks(5).tickSize(-width).tickFormat("")); 

        

        /*// Summary Stats
        barChart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Movies");

        barChart.append("text")
            .attr("x", width - margin.right)
            .attr("dy", "1em")
            .attr("text-anchor", "end")
            .text("Passed: " + 10);

        svg.append("text")
            .attr("transform",
                  "translate(" + ((width + margin.right + margin.left)/2) + " ," +
                                 (height + margin.top + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text("Year");

        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom); */

             /* // append scatter plot to brush chart area
               var movies = context.append("g");
                   movies.attr("clip-path", "url(#clip)");
                   movies.selectAll("movie_bar")
                      .data(data)
                      .enter().append("circle")
                      .attr('class', 'movie_barContext')
                      .attr("r",3)
                      .style("opacity", .6)
                      .attr("cx", function(d) { return x2(d.sent_time); })
                      .attr("cy", function(d) { return y2(d.movies_sent_in_day); })

              context.append("g")
                    .attr("class", "axis x-axis")
                    .attr("transform", "translate(0," + height2 + ")")
                    .call(xAxis2);

              context.append("g")
                    .attr("class", "brush")
                    .call(brush)
                    .call(brush.move, x.range());*/

      });
}


//create brush function redraw scatterplot with selection
function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  barChart.selectAll(".movie_bar")
        .attr("cx", function(d) { return x(d.sent_time); })
        .attr("cy", function(d) { return y(d.movies_sent_in_day); });
  barChart.select(".x-axis").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  barChart.selectAll(".movie_bar")
        .attr("cx", function(d) { return x(d.sent_time); })
        .attr("cy", function(d) { return y(d.movies_sent_in_day); });
  barChart.select(".x-axis").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}
