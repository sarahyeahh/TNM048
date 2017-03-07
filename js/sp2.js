//Måste ha d3 v4 för att fungera!

function sp2(){

  var self = this;

    var spDiv = $("#sp2");

    var margin = {top: 20, right: 20, bottom: 30, left: 90},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;
     
    var varXaxis = "";
    var varYaxis = "";        

    var color = d3.scaleOrdinal(d3.schemeCategory20); //new v4 

    //initialize tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 1);    

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x).tickFormat(d3.format("d")); 
    var yAxis = d3.axisLeft(y);

    var svg = d3.select("#sp2").append("svg")
              .attr("id", "g2_svg")
              .attr("data-margin-right", margin.right)
              .attr("data-margin-left", margin.left)
              .attr("data-margin-top", margin.top)
              .attr("data-margin-bottom", margin.bottom)
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width )
            .attr("height", height )
            .attr("x", 0) 
            .attr("y", 0); 

    var scatter = svg.append("g")
             .attr("id", "scatterplot")
             .attr("clip-path", "url(#clip)");

    //Load data
    d3.csv("data/movie_metadata.csv", function(error, data) {
        self.data = data;
    
        //define the domain of the scatter plot axes
        varXaxis = "imdb_score";
        varYaxis = "gross";

        max =  800000000;

       // x.domain(d3.extent(data, function(d){return d[varXaxis];}));
        x.domain([0, 10]); 
        y.domain([0, max]); 

        draw();

    });

    function draw(){

        var cc = {};

        self.data.forEach( function(d){
            cc[d.movie_title] = color(d.movie_title);
        } );

        svg.append("g")
         .attr("class", "x axis ")
         .attr('id', "axis--x")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis)
         .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .attr("dx", "3em")
                .style("text-anchor", "end")
                .style("font-size","10px")
                .text(varXaxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr('id', "axis--y")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("font-size","10px")
                .text(varYaxis);

        // // Add the scatter dots.
        scatter.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            .attr("r", 3)
            .attr("cx", function(d) { return x(d[varXaxis]);})
            .attr("cy", function(d) {return y(d[varYaxis]);})
            //.style("fill", function(d) { if (d.binary != "PASS"){ return "red"} else{return "green"}})
            .style("fill", function(d) {return cc[d.movie_title]})
            //tooltip
            .on("mousemove", function(d) {
                tooltip.transition()
                   .duration(20)
                   .style("opacity", 0.9);
                tooltip.html(d.movie_title + "<br/> Income: "  + d[varYaxis] + "<br/> imdbRating: " + d[varXaxis])
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");   
                })
            .on("mouseout", function(d){ 
                tooltip.style("opacity", 0); 
            })
            .on("click",  function(d) {
                var array = [];
                array[d.movie_title] = d.movie_title;               
                window.open(d.movie_imdb_link);
              //  sp1.selectDot(array);
              //  pc1.selectLine(array);
                
            });

    }


   // // //method for selecting the dot from other components
   //  this.selectDot = function(value){
   //      //...
   //      var dots = d3.selectAll(".dot")
   //      //dots.style("opacity", function(d, i) { if (i = "Sweden") { return "1"} else {return "0"} }); 
   //      .style("opacity", function(d, i) { if (value[d.title] == d.title) { return "1"} else {return "0.2"} }); 
   //  };
    
   //  //method for selecting features of other components
   //  function selFeature(value){
   //      //...
   //  }


}
