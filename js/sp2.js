//Måste ha d3 v4 för att fungera!

function sp2(bec_data, imdb_data){

  var self = this;

    var spDiv = $("#sp2");

    var margin = {top: 20, right: 20, bottom: 30, left: 90},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;
     
    var varXaxis = "";
    var varYaxis = "";        

    var color = d3.scaleOrdinal(d3.schemeCategory20b); //new v4 
    for (var i = 0; i < 20; i++) {
        color(i);
    };

    var genre_data = imdb_data;

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

   
    var pass_rate = [0,0,0,0,0,0,0,0,0,0];
    var passed = [0,0,0,0,0,0,0,0,0,0];
    var failed = [0,0,0,0,0,0,0,0,0,0];

    uppdate_pass_rate();

    function uppdate_pass_rate(){
      pass_rate = [0,0,0,0,0,0,0,0,0,0];
      passed = [0,0,0,0,0,0,0,0,0,0];
      failed = [0,0,0,0,0,0,0,0,0,0];
        for (var i = 0; i < bec_data.length; i++) {
          for (var j = 0; j < genre_data.length; j++) {
            if (genre_data[j].movie_title.includes(bec_data[i]["title"])) {
              if (bec_data[i]["binary"] == "PASS") {
                passed[Math.floor(genre_data[j]["imdb_score"])] += 1;
              }
              else {
                failed[Math.floor(genre_data[j]["imdb_score"])] += 1;
              }
            }
          };
        };

      for (var i = 0; i < pass_rate.length; i++) {
        if((failed[i]+passed[i]) > 0) {
          pass_rate[i] = passed[i] / (passed[i] + failed[i]);
        }
        else {
          pass_rate[i] = -1;
        }
      };
    }


    function update_data(genre){
      if (genre != 0) {
        genre_data = [];
        for (var i = 0; i < imdb_data.length; i++) {
          if (genre == "Horror") {
            if (imdb_data[i].genres.includes("Horror")) {
              genre_data.push(imdb_data[i]);
            }
          }
          else if (genre == "Romance"){
            if (imdb_data[i].genres.includes("Horror")) {}
            else if (imdb_data[i].genres.includes("Romance")) {
              genre_data.push(imdb_data[i]);
            }
          }
          else if (genre == "Drama"){
            if (imdb_data[i].genres.includes("Horror")) {}
            else if (imdb_data[i].genres.includes("Romance")) {}
            else if (imdb_data[i].genres.includes("Drama")) {
              genre_data.push(imdb_data[i]);
            }
          }
          else if (genre == "Comedy"){
            if (imdb_data[i].genres.includes("Horror")) {}
            else if (imdb_data[i].genres.includes("Romance")) {}
            else if (imdb_data[i].genres.includes("Drama")) {}
            else if (imdb_data[i].genres.includes("Comedy")) {
              genre_data.push(imdb_data[i]);
            }
          }
          else if (genre == "Action"){
            if (imdb_data[i].genres.includes("Horror")) {}
            else if (imdb_data[i].genres.includes("Romance")) {}
            else if (imdb_data[i].genres.includes("Drama")) {}
            else if (imdb_data[i].genres.includes("Comedy")) {}
            else if (imdb_data[i].genres.includes("Action")) {
              genre_data.push(imdb_data[i]);
            }
          }
          else{
            if (imdb_data[i].genres.includes("Horror")) {}
            else if (imdb_data[i].genres.includes("Romance")) {}
            else if (imdb_data[i].genres.includes("Drama")) {}
            else if (imdb_data[i].genres.includes("Comedy")) {}
            else if (imdb_data[i].genres.includes("Action")) {}
            else {genre_data.push(imdb_data[i]);}
          }
        };
      }
      else {
        genre_data = imdb_data;
      }
      
    }

    //define the domain of the scatter plot axes
    varXaxis = "imdb_score";
    varYaxis = "gross";
    //varYaxis = "cast_total_facebook_likes";
    //varYaxis = "facenumber_in_poster";

    max =  800000000;
    //max = d3.max(imdb_data, function(d) {return d[varYaxis] ;});
    //max += 10;
   // x.domain(d3.extent(data, function(d){return d[varXaxis];}));
    x.domain([0, 10]); 
    y.domain([0, max]); 
    //y.domain(d3.extent(imdb_data, function(d){return d[varYaxis];}));
    //x.domain(d3.extent(data, function(d){return d[varXaxis];}));

    function color_bec(title) {
      for (var i = 0; i < bec_data.length; i++) {
        if (title.includes(bec_data[i]["title"])) {
          if(bec_data[i]["binary"] == "PASS"){
            return color(5);
          }
          return color(13);
        }
      };
      return "blue";
    }

    function color_clusters(rating) {
      var score = Math.floor(rating);
      var rate = pass_rate[score];
                if (rate == -1){
                    return "white";
                }
                else if (rate > 0.75) { 
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

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Grossings");

    svg.append("text")
        //.attr("transform", "rotate(0)")
        .attr("y", height + 2*margin.bottom/3)
        .attr("x", width/2 )
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("IMDB score");

    this.draw = function(genre){
        svg.selectAll(".dot2").remove();
        svg.selectAll(".dot").remove();
        update_data(genre);
        uppdate_pass_rate();
        /*var cc = {};

        self.data.forEach( function(d){
            cc[d.country] = color(d.country);
        } );*/

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
        scatter.selectAll(".dot2")
            .data(pass_rate)
            .enter().append("rect")
            .attr("class", "dot2")
            //Define the x and y coordinate data values for the dots
            //.attr("r", 20)
            .attr("x", function(d,i) { return x(i);})
            .attr("y", function(d) {return y(max);})
            .attr("height", height)
            .attr("width", x(2)-x(1))
            //.style("fill", function(d) { if (d.binary != "PASS"){ return "red"} else{return "green"}})
            .style("fill", function(d,i) {return color_clusters(i);}) //  color_bec(d.movie_title) return color_duration(d.duration), return cc[d.country]
            .style("opacity",0.3)
            

        scatter.selectAll(".dot")
            .data(genre_data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            .attr("r", 3)
            .attr("cx", function(d) { return x(d[varXaxis]);})
            .attr("cy", function(d) {return y(d[varYaxis]);})
            //.style("fill", function(d) { if (d.binary != "PASS"){ return "red"} else{return "green"}})
            .style("fill", function(d) {return color_bec(d.movie_title);})
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
    this.draw(0);



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