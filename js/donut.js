function donut(bec_data, imdb_data) {
	
	var myDuration = 600;
	var firstTime = true;

	var doDiv = $("#donut1");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = doDiv.width() - margin.right - margin.left,
        height = doDiv.height() - margin.top - margin.bottom,
        radius = Math.min(width, height) / 2 - 10;

	var color = d3.scaleOrdinal(d3.schemeCategory20b); //new v4 
	for (var i = 0; i < 20; i++) {
	        color(i);
    };


    var svg = d3.select("#donut1").append("svg")
              .attr("id", "g1_svg")
              .attr("data-margin-right", margin.right)
              .attr("data-margin-left", margin.left)
              .attr("data-margin-top", margin.top)
              .attr("data-margin-bottom", margin.bottom)
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);
              
	var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	    //g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var bechdel = [];
    var genres = [];

    for (var i = 0; i < bec_data.length; i++) {
    	var genre_of_movie =  "Other";

    	for (var j = 0; j < imdb_data.length; j++) {
    		if (imdb_data[j].movie_title.includes(bec_data[i]["title"])) {
    			if (imdb_data[j].genres.includes("Horror")) {
    				genre_of_movie = "Horror";
    			}			
    			else if (imdb_data[j].genres.includes("Romance")) {
    				genre_of_movie = "Romance";
    			}
    			else if (imdb_data[j].genres.includes("Drama")) {
    				genre_of_movie = "Drama";
    			}
   				else if (imdb_data[j].genres.includes("Comedy")) {
    				genre_of_movie = "Comedy";
    			}
    			else if (imdb_data[j].genres.includes("Action")) {
    				genre_of_movie = "Action";
    			}	
    			break;
    		};
    	};
    	
        if (genres.indexOf(genre_of_movie) < 0) {
                var newGenre = {
                    genre : genre_of_movie,
                    passed : 0,
                    failed : 0
                };

                bechdel.push(newGenre);
                genres.push(genre_of_movie);
            }

        if (bec_data[i]["binary"] == "PASS") {
            bechdel.forEach( function(d) {
                if (d["genre"] == genre_of_movie) {
                    d["passed"] += 1;
                }
            });
        }
        else {
            bechdel.forEach( function(d) {
                if (d["genre"] == genre_of_movie) {
                    d["failed"] += 1;
                }
            });
        }
            
    };

    console.log(bechdel);

    function color_bec(d) {
        var rate = d.passed/(d.passed+d.failed);
        console.log(rate);
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

	var pie = d3.pie()
	    .sort(null)
	    .value(function(d) { return d.passed + d.failed; });

	var path = d3.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(radius - 2*radius/3)
	    .padAngle(0.03)
        //.cornerRadius(8);

	var label = d3.arc()
	    .outerRadius(radius + 5)
	    .innerRadius(radius + 5);

	var arc = g.selectAll(".arc")
	    .data(pie(bechdel))
	    .enter().append("g")
	    .attr("class", "arc");

	var click = 0;
	var chosen = 0;
	
	draw();
	function draw(){
		svg.selectAll(".donutPart").remove();
		arc.append("path")
		    .attr("d", path)
		    .attr("class", "donutPart")
		    .style("fill", function(d,i) { return color_bec(bechdel[i]); })
		    .style("stroke", "gray")
		    .style("opacity", function(d) { if(chosen == d.data.genre) {return 1.0} else{return 0.4 }})
		    .on("click", function(d) {
		    	if (click == 0) {
		    		donut2.uppdate_genre(d.data.genre);
			    	donut2.draw();
			    	sp2.draw(d.data.genre);
			    	area1.draw(d.data.genre);
			    	click++;
			    	chosen = d.data.genre;
			    	draw()
		    	}
		    	else {
		    		donut2.uppdate_genre(0);
			    	donut2.draw();
			    	sp2.draw(0);
			    	area1.draw(0);
			    	chosen = 0;
			    	draw();
			    	click--;
		    	}

		    	
		    })
	}

	arc.append("text")
	    .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
	    .attr("dy", "0.35em")
	    .text(function(d) { return d.data.genre; });

	
}