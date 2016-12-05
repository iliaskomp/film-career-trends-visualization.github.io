function LineGraph() {
	this.people = [];
	this.vis = d3.select('#visualization');
	this.WIDTH = 1000;
	this.HEIGHT = 500;
	this.MARGINS = {
			top: 20,
		    right: 20,
		    bottom: 20,
		    left: 50
		};
	this.lineColors = [
	    	'#ff0000',
	    	'#00ff00',
	    	'#0000ff',
	    	'#0f0f0f',
	    	'#930039'
	    ];
}

LineGraph.prototype.getDateRange = function getDateRange() {
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
	
	return {min: minDate, max: maxDate};
}

LineGraph.prototype.drawGraph = function drawGraph() {
	var self = this;
	
	//self.drawGraphAxis();
	self.drawGraphLines();
}

LineGraph.prototype.drawGraphAxis = function drawGraphAxis() {
	var self = this;
	
	var xAxis = d3.svg.axis()
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
    .attr('transform', 'translate(' + (self.MARGINS.left) + ',0)')
    .call(yAxis);
}

LineGraph.prototype.drawGraphLines = function drawGraphLines() {
	var self = this;
	
	for(var i=0; i<self.people.length; i++) {
		var person = self.people[i];
			
		var 
			xRange = d3.scale.linear().range([self.MARGINS.left, self.WIDTH - self.MARGINS.right]).domain([d3.min(person.films, function(d) {    
			    return d.getYear();
			}), d3.max(person.films, function(d) {  
			    return d.getYear();
			})]),
			
			yRange = d3.scale.linear().range([self.HEIGHT - self.MARGINS.top, self.MARGINS.bottom]).domain([d3.min(person.films, function(d) {
			    return 0;
			}), d3.max(person.films, function(d) {
			    return 10;
			})]),	
	
		    lineFunc = d3.svg.line()
			    .x(function(d) {
			      return xRange(d.getYear());
			    })
			    .y(function(d) {
			      return yRange(d.vote_average);
			    })
			    .interpolate('bundle');
	
	    person.graphLine =
	    	self.vis.append('svg:path')
			    .attr('d', lineFunc(person.films))
			    .attr('stroke', self.lineColors[self.people.length-1])
			    .attr('stroke-width', 2)
			    .attr('fill', 'none');
	}
}

Person.prototype.removeGraphLine = function removeGraphLine() {
	var self = this;
	self.graphLine.remove();
	self.graphLine = null;
}

var lineGraph = new LineGraph();
