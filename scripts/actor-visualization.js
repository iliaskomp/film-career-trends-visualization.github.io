var graphLines = {};
var filmGraphData = [];
var lineColors = [
                  '#ff0000',
                  '#00ff00',
                  '#0000ff',
                  '#0f0f0f',
                  '#930039'
                  ]

Person.prototype.showFilmGraph = function showFilmGraph() {
  var filmGraphData = [];
  var self = this;

  console.log("showFilmGraph");
  console.log(self.films);

  var vis = d3.select('#visualization'),
  WIDTH = 1000,
  HEIGHT = 500,
  MARGINS = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
  },    

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

    /*vis.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .call(xAxis);
     */
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

    self.graphLine =
    	vis.append('svg:path')
		    .attr('d', lineFunc(self.films))
		    .attr('stroke', lineColors[people.length-1])
		    .attr('stroke-width', 2)
		    .attr('fill', 'none');
}

Person.prototype.removeGraphLine = function removeGraphLine() {
	var self = this;
	self.graphLine.remove();
	self.graphLine = null;
}
