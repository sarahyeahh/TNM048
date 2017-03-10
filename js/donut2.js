function donut2(bec_data, imdb_data) {
    
    var myDuration = 600;
    var firstTime = true;

    var doDiv = $("#donut2");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = doDiv.width() - margin.right - margin.left,
        height = doDiv.height() - margin.top - margin.bottom,
        radius = Math.min(width, height) / 2 - 10;

    var color = d3.scaleOrdinal(d3.schemeCategory20b); //new v4 
    for (var i = 0; i < 20; i++) {
            color(i);
    };


    var svg = d3.select("#donut2").append("svg")
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

    var specific = [];
    this.uppdate_genre = function(genre){

        specific = [];
        specific[0] = {movies: 0};
        specific[1] = {movies: 0};
        for (var i = 0; i < bechdel.length; i++) {
            if(bechdel[i].genre == genre || genre == 0){
                specific[0].movies += bechdel[i].passed;
                specific[1].movies += bechdel[i].failed; 
            }      
        };
        
    }

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.movies; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 2*radius/3)
        .padAngle(0.03)
        //.cornerRadius(8);

    this.draw = function(){
        svg.selectAll(".arc2").remove();
        var arc = g.selectAll(".arc2")
            .data(pie(specific))
            .enter().append("g")
            .attr("class", "arc2");

        arc.append("path")
            .attr("d", path)
            .style("fill", function(d,i) { if (i != 1){ return color(5)} else{return color(13)} })
    };

    this.uppdate_genre(0);
    this.draw();

}