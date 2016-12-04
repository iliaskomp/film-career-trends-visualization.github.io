
var filmGraphData = [];

// for (var i = 0; i < filmDataFull.results.length; i++) {
//   var filmForGraph = new FilmForGraph(filmDataFull.results[i].release_date.substring(0, 4), filmDataFull.results[i].vote_average);
//   filmGraphData.push(filmForGraph);
// }

function FilmForGraph(year, rating) {
  this.year = year.substring(0, 4);
  this.rating = rating;
}

Person.prototype.showFilmGraph = function showFilmGraph() {
  var filmGraphData = [];
  var self = this;

  console.log("showFilmGraph");
  console.log(self.films);

  for(var i=0; i<self.films.length; i++) {
    var obj = self.films[i];
    filmForGraph = new FilmForGraph(obj.getYear(), obj.vote_average);
    filmGraphData.push(filmForGraph);
  }


  var vis = d3.select('#visualization'),
  WIDTH = 1000,
  HEIGHT = 500,
  MARGINS = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
  },    

  // xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(filmGraphData, function(d) {    
  //   return d.year;
  // }), d3.max(filmGraphData, function(d) {  
  //   return d.year;
  // })]),

  // yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(filmGraphData, function(d) {
  //   return 0;
  // }), d3.max(filmGraphData, function(d) {
  //   return 10;
  // })]),

  xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(self.films, function(d) {    
    return d.getYear();
  }), d3.max(self.films, function(d) {  
    return d.getYear();
  })]),

  yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(self.films, function(d) {
    return 0;
  }), d3.max(self.films, function(d) {
    return 10;
  })]),


    xAxis = d3.svg.axis()
    .scale(xRange)
    .tickSize(2)
    .tickSubdivide(true),
    yAxis = d3.svg.axis()
    .scale(yRange)
    .tickSize(2)
    .orient('left')
    .tickSubdivide(true);

    vis.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .call(xAxis);

    vis.append('svg:g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(yAxis);


    var lineFunc = d3.svg.line()
    .x(function(d) {
      return xRange(d.getYear());
    })
    .y(function(d) {
      return yRange(d.vote_average);
    })
    .interpolate('linear');

    vis.append('svg:path')
    .attr('d', lineFunc(self.films))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  }