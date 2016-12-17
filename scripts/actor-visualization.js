function LineGraph() {
	this.people = [];
	this.vis = d3.select('#visualization');
	this.xRange = null;
	this.yRange = null;
	this.WIDTH = 1000;
	this.HEIGHT = 500;
	this.MARGINS = {
			top: 20,
		    right: 20,
		    bottom: 20,
		    left: 50
		};
	this.lineColors = {
	    	'#ff0000',
	    	'#00ff00',
	    	'#0000ff',
	    	'#0f0f0f',
	    	'#930039'
	    ];
}

LineGraph.prototype.getDateRange = function getDateRange() {
	var self = this;
	var minDate; var maxDate;
	
	for(var i=0; i<self.people.length; i++) {
		var person = self.people[i];
		var personMin = person.getMinDate();
		var personMax = person.getMaxDate();
		
		if(!minDate || personMin < minDate) {
			minDate = personMin;
		}
		if(!maxDate || personMax > maxDate) {
			maxDate = personMax;
		}
	}
	
	return [minDate, maxDate];
}

LineGraph.prototype.drawGraph = function drawGraph() {
	var self = this;
	
	self.vis.html('');
	self.drawGraphAxis();
	self.drawGraphLines();
}

LineGraph.prototype.drawGraphAxis = function drawGraphAxis() {
	var self = this;
		
	var dateRange = self.getDateRange(),
		xAxis,
		yAxis;
	    
	self.xRange = d3.time.scale().range([self.MARGINS.left, self.WIDTH - self.MARGINS.right]).domain(dateRange),
	self.yRange = d3.scale.linear().range([self.HEIGHT - self.MARGINS.top, self.MARGINS.bottom]).domain([0,10]),

	xAxis = d3.svg.axis()
	    .scale(self.xRange)
	    .tickSize(2)
	    .tickSubdivide(true)
	    .tickFormat(d3.time.format("%Y")),
    yAxis = d3.svg.axis()
	    .scale(self.yRange)
	    .tickSize(2)
	    .orient('left')
	    .tickSubdivide(true);

    self.vis.append('svg:g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + (self.HEIGHT - self.MARGINS.bottom) + ')')
	    .call(xAxis);
	    
    self.vis.append('svg:g')
	    .attr('class', 'y axis')
	    .attr('transform', 'translate(' + (self.MARGINS.left) + ',0)')
	    .call(yAxis);
}

LineGraph.prototype.drawGraphLines = function drawGraphLines() {
	var self = this;
	
	for(var i=0; i<self.people.length; i++) {
		var person = self.people[i];
			
		var lineFunc = d3.svg.line()
			    .x(function(d) {
			      return self.xRange(d.getReleaseDateObj());
			    })
			    .y(function(d) {
			      return self.yRange(d.vote_average);
			    })
			    .interpolate('bundle');
	
	    person.graphLine =
	    	self.vis.append('svg:path')
			    .attr('d', lineFunc(person.films))
			    .attr('stroke', self.lineColors[i])
			    .attr('stroke-width', 2)
			    .attr('fill', 'none')
	    		.style('opacity', 0.3);
	}
}

var lineGraph = new LineGraph();
