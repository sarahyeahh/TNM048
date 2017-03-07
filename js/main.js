var pc1 = new pc();
var sp1 = new sp();
var sp2 = new sp2();
//var sp1 = new sp();

var area1; 

d3.csv("data/movies.csv", function (data) {

    area1 = new area(data);
    //map1 = new map(data);

});
