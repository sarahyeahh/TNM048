function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

	//...
	var varXaxis = "";
	var varYaxis = "";
	var varHoover = "";
	//...
	
    //initialize color scale
    //...
	var color = d3.scale.category20() ;
    
    //initialize tooltip
    //...

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
	
    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;
        console.log(data);
		
        //define the domain of the scatter plot axes
        //...
		varXaxis = "Household income";
		varYaxis = "Employment rate";
		
		x.domain(d3.extent(data, function(d){return d[varXaxis];}));
		y.domain(d3.extent(data, function(d){return d[varYaxis];}));

		//y.domain([d3.min(data, function(d) { return d[varYaxis]; }) -1, d3.max(data, function(d) { return d[varYaxis]; })]);
		//x.domain([d3.min(data, function(d) { return d[varXaxis]; }) -1, d3.max(data, function(d) { return d[varXaxis]; })]);
		
		//...
        draw();

    });
	

    function draw()
    {
		// //...
  //       var cc = {};
		// self.data.forEach( function(d){
		// 	cc[d["Country"]] = color(d["Country"]);
		// } )
		// //...
		
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
			.style("text-anchor", "end")
			.style("font-size","10px")
			.text(varXaxis);
            
        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
			.style("text-anchor", "end")
			.style("font-size","10px")
			.text(varYaxis);
            
        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            //...
			.attr("r", 4)
			.attr("cx", function(d) {return x(d[varXaxis]);})
			.attr("cy", function(d) {return y(d[varYaxis]);})
			.style("fill", function(d) {return cc[d["Country"]]})
            //tooltip
            .on("mousemove", function(d) {
                tooltip.transition()
				   .duration(20)
				   .style("opacity", .9);
				tooltip.html(d["Country"] )
				   .style("left", (d3.event.pageX + 5) + "px")
				   .style("top", (d3.event.pageY - 28) + "px");   
				})
            .on("mouseout", function(d){ 
				tooltip.style("opacity", 0); 
            })
            .on("click",  function(d) {
				var array = [];
				array[d["Country"]] = d["Country"];
				sp1.selectDot(array);
				pc1.selectLine(array);
				
            });
			
			// yMap = function(d){return y(d[varYaxis]);} 
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        //...
		var dots = d3.selectAll(".dot")
		//dots.style("opacity", function(d, i) { if (i = "Sweden") { return "1"} else {return "0"} }); 
		dots.style("opacity", function(d, i) { if (value[d["Country"]] == d["Country"]) { return "1"} else {return "0.2"} }); 
    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}




