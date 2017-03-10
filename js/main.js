//var pc1 = new pc();
var sp1;

//var sp1 = new sp();
var sp2;
var area1; 
var donut1;
var donut2;

d3.csv("data/movies.csv", function (bec_data) {

	var filtered_imdb_data = [];
	d3.csv("data/movie_metadata.csv", function(error, imdb_data) {
		for (var i = 0; i < bec_data.length; i++) {
          	for (var j = 0; j < imdb_data.length; j++) {
            	if (imdb_data[j].movie_title.includes(bec_data[i]["title"])) {
              		filtered_imdb_data.push(imdb_data[j]);
            	}
          	};
          
        };
        area1 = new area(bec_data, filtered_imdb_data);
	    sp2 = new sp2(bec_data,filtered_imdb_data);
	    //sp1 = new sp(bec_data);
	    donut2 = new donut2(bec_data, filtered_imdb_data);
	    donut1 = new donut(bec_data, filtered_imdb_data);
	    
	    //donut2.draw();
	});
    
    //map1 = new map(data);

});



