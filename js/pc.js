function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];

    //...
	var var1 = "", var2 = "", var3 = "", var4 = "", var5 = "";
	
	//...
	
	
    //initialize color scale
    //...
	var color = d3.scale.category20() ;
    
    //initialize tooltip
    //...

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};
        

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

	var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
	
//OBS GAMMAL DATA!!!
  //   d3.csv("data/OECD-better-life-index-hi.csv", function(data) {

  //       self.data = data;

  //       // Extract the list of dimensions and create a scale for each.
  //       //...
		// var1 = "Personal earnings";
		// var2 = "Quality of support network";
		// var3 = "Student skills";
		// var4 = "Voter turnout";
		// var5 = "Life satisfaction";
		
		// console.log(var1);
		
  //       x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
  //           return (d == var1 || d == var2 || d == var3 || d == var4 || d == var5)
		// 		&& [(y[d] = d3.scale.linear()
  //               //.domain(d3.extent([0,1]))
		// 		.domain(d3.extent(data, function(p){return +p[d];}))
  //               .range([height, 0]))];
  //       }));

  //       draw();
  //   });


     //Load IMDB data
    d3.csv("data/imdb.csv", function(data) {


        data.forEach(function(d) {

        d.title = d.title;
        d["year"] = +d["year"];
        d.fn = +d.fn; // IMDB-code titles01/tt0012349
        d["imdbRating"] = +d["imdbRating"];

        });


    });

       //Load Bechdel data
    d3.csv("data/movies.csv", function(data) {


        data.forEach(function(d) {

        d.title = d.title;
        d["year"] = +d["year"];
        d.binary = d.binary; //Pass or fail
        d["domgross"] = +d["domgross"];
        d["intgross"] = +d["intgross"];
        d["budget"] = +d["budget"];     

        });

    });


    function draw(){
		//...
  //       var cc = {};
		// self.data.forEach( function(d){
		// 	cc[d["Country"]] = color(d["Country"]);
		// } )
		//...
		
        // Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            //add the data and append the path 
            //...
			.data(self.data)
			.enter().append("path")
			.attr("d", path)
			//...
            .on("mousemove", function(d) {
                tooltip.transition()
				   .duration(20)
				   .style("opacity", .9);
				tooltip.html(d["Country"] )
				   .style("left", (d3.event.pageX + 5) + "px")
				   .style("top", (d3.event.pageY - 28) + "px");   
				})
            .on("mouseout", function(d){ 
				tooltip.style("opacity", 0);})
			.on("click", function(d) {
				var array = [];
				array[d["Country"]] = d["Country"];
				sp1.selectDot(array);
				pc1.selectLine(array); 
			});

        // Add blue foreground lines for focus.
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            //add the data and append the path 
            //...
			.data(self.data)
			.enter().append("path")
			.attr("d", path)
			//...
			.style("stroke", function(d) {return cc[d["Country"]]})
			//...
            .on("mousemove", function(d) {
                tooltip.transition()
				   .duration(20)
				   .style("opacity", .9);
				tooltip.html(d["Country"] )
				   .style("left", (d3.event.pageX + 5) + "px")
				   .style("top", (d3.event.pageY - 28) + "px");   
				})
            .on("mouseout", function(d){ 
				tooltip.style("opacity", 0);})
			.on("click", function(d) {
				var array = [];
				array[d["Country"]] = d["Country"];
				sp1.selectDot(array);
				pc1.selectLine(array); 
			});

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
            
        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            //add scale
			//...
			.each(function(d) {d3.select(this).call(axis.scale(y[d]));})
			//...
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
		var sc = []; // selected countreis
		
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
			if (actives.length == 0) {
				sc[d["Country"]] = d["Country"];
			}
			else {
				return actives.every(function(p, i) {
					if (extents[i][0] <= d[p] && d[p] <= extents[i][1]) {
						// save the country
						sc[d["Country"]] = d["Country"];
						return true;
					} 
				}) ? null : "none";
			}
            
			
        });
		sp1.selectDot(sc);
		
    }

    //method for selecting the pololyne from other components	
    this.selectLine = function(value){
        var theLines = d3.selectAll(".line")
		foreground.style("display", function(d, i) { if (value[d["Country"]] == d["Country"]) { return "unset"} else {return "none"} });
		
    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
    };

}
