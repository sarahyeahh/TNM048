//Måste ha d3 v4 för att fungera!

function sp(data){

  var self = this;

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 90},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;
     
    var varXaxis = "";
    var varYaxis = "";

    var color = d3.scaleOrdinal(d3.schemeCategory20b); //new v4 
    for (var i = 0; i < 20; i++) {
        color(i);
    };

    //initialize tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 1);    

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x).tickFormat(d3.format("d")); 
    var yAxis = d3.axisLeft(y);

    var brush = d3.brush().extent([[0, 0], [width, height]])
                .on("end", brushended), idleTimeout, idleDelay = 350;

    var svg = d3.select("#sp").append("svg")
              .attr("id", "g1_svg")
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
    /*d3.csv("data/movies.csv", function(error, data) {
        self.data = data;
    
         
        

    });*/
    //define the domain of the scatter plot axes
    varXaxis = "budget";
    varYaxis = "domgross";
      //  max = 3000000000; 
    //max = 800000000;
    max = d3.max(data, function(d){return d[varYaxis];});

    x.domain(d3.extent(data, function(d){return d[varXaxis];}));
    y.domain([0, max]);
    //y.domain([0, max]); 

    var pass_rate = [0,0,0,0,0,0,0,0,0,0];
    var passed = [0,0,0,0,0,0,0,0,0,0];
    var failed = [0,0,0,0,0,0,0,0,0,0];
    var cluster_size = 1000000; //d3.max(data, function(d){return d[varXaxis];})/10;
    for (var i = 0; i < data.length; i++) {
      var slot = Math.floor(data[i].budget / cluster_size);
      if (data[i].binary == "PASS") {
        passed[slot] += 1;
      }
      else {
        failed[slot] += 1;
      }
    };
      
    console.log(passed);
    for (var i = 0; i < pass_rate.length; i++) {
      if((failed[i]+passed[i]) > 0) {
        pass_rate[i] = passed[i] / (passed[i] + failed[i]);
      }
    };
    console.log(pass_rate);

    draw();
    countPass();

    function color_clusters(slot) {
      var rate = pass_rate[slot];
        if (rate > 0.75) { 
            return color(4);
        }
        else if (rate > 0.55) {
            return color(5);
        }
        else if (rate < 0.25) {
            return color(14);
        }
        else if (rate < 0.45) {
            return color(15);
        }
        else {
            return color(10);
        }
    }

    function draw(){

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


        scatter.selectAll(".dot2")
            .data(pass_rate)
            .enter().append("rect")
            .attr("class", "dot2")
            //Define the x and y coordinate data values for the dots
            //.attr("r", 20)
            .attr("x", function(d,i) { return x(i*cluster_size);})
            .attr("y", function(d) {return y(max);})
            .attr("height", height)
            .attr("width", x(cluster_size)-x(0))
            //.style("fill", function(d) { if (d.binary != "PASS"){ return "red"} else{return "green"}})
            .style("fill", function(d,i) {return color_clusters(i);}) //  color_bec(d.movie_title) return color_duration(d.duration), return cc[d.country]
            .style("opacity",0.5)

        // // Add the scatter dots.
        scatter.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            .attr("r", 3)
            .attr("cx", function(d) {return x(d[varXaxis]);})
            .attr("cy", function(d) { 
                if (d[varYaxis] == "#N/A")
                {
                    //Om något värde är #N/A ska den sättas till -500000.
                    d[varYaxis]=-5000000;
                } 
                return y(d[varYaxis]);
            })
            .style("fill", function(d) { if (d.binary != "PASS"){ return color(13)} else{return color(5)}})
            //tooltip
            /*.on("mousemove", function(d) {
                tooltip.transition()
                   .duration(20)
                   .style("opacity", 0.5);
                tooltip.html(d.title + "<br/> Income: "  + d[varYaxis] + "<br/> Year: " + d[varXaxis])
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");   
                })
            .on("mouseout", function(d){ 
                tooltip.style("opacity", 0); 
            })
            .on("click",  function(d) {
                var array = [];
                array[d.title] = d.title;
              //  sp1.selectDot(array);
              //  pc1.selectLine(array);  
            });*/

        scatter.append("g")
            .attr("class", "brush")
            .call(brush);
    
    }


    function brushended() {

            var s = d3.event.selection;

            if (!s) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
                  x.domain(d3.extent(data, function(d){return d[varXaxis];}));
                  y.domain([0, max]); 
            } else {
                
                x.domain([s[0][0], s[1][0]].map(x.invert, x));
                y.domain([s[1][1], s[0][1]].map(y.invert, y));
      
                scatter.select(".brush")
                    .call(brush.move, null);
            }
            zoom();
    }

    function idled() {
            idleTimeout = null;
    }

    function zoom() {

        var t = scatter.transition().duration(750);
        svg.select("#axis--x").transition(t).call(xAxis);
        svg.select("#axis--y").transition(t).call(yAxis);

        scatter.selectAll("circle").transition(t)
            .attr("cx", function (d) { return x(d[varXaxis]); })
            .attr("cy", function (d) { return y(d[varYaxis]); });
    }

    //Count all the movies whether they fail or pass. 
    function countPass(){

        var pass = 0; 
        var fail = 0; 
        var all = 0; 

        data.forEach( function(d){
             
             if(d.binary== "PASS"){  
                pass++; 
             }
             else{
                fail++; 
             }

            all++;

         } );

        //Writes in <div id="count"> how many movies that pass/fail.
       document.getElementById("count").innerHTML = "<b>Pass:</b> " + pass + "<br> <b>Fail:</b> " + fail + "<br> of total:" + all + " movies."; 

    }

    // function passfail(){
    //        // console.log(d.binary);

    //         var dots = d3.selectAll(".dot")
    //            .style("fill", function(d) { console.log(d.binary); if (d.binary != "PASS"){ return "red"} else{return "green"}})

    // }

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
