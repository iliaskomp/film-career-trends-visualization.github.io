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
	this.lineColors = [
	    	'#cc0000',
	    	'#00cc00',
	    	'#0000cc',
	    	'#ff8040',
	    	'#00c0c0'
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

LineGraph.prototype.getNextAvailableColor = function getNextAvailableColor() {
	var self = this;
	
	for(var i=0; i<self.lineColors.length; i++) {
		var found = false;
		for(var j=0; j<self.people.length; j++) {
			if(self.people[j].color === i) {
				found = true;
			}
		}
		if(!found) return i;
	}
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
			    .interpolate('basis');
	
		if(person.color < 0) {
			person.color = self.getNextAvailableColor();
		}
	    person.graphLine =
	    	self.vis.append('svg:path')
			    .attr('d', lineFunc(person.films))
			    .attr('stroke', self.lineColors[person.color])
			    .attr('stroke-width', 1)
			    .attr('fill', 'none')
	    		.style('opacity', 0.5);
	    
	    person.scatterplot = 
	    	self.vis.selectAll('.dot-'+person.color)
	    		.data(person.films)
	    		.enter().append('circle')
	    		.attr('class', 'dot dot-'+person.color)
	    		.attr('r', 3.5)
	    		.attr('cx', function(d) { return self.xRange(d.getReleaseDateObj()); })
	    		.attr('cy', function(d) { return self.yRange(d.vote_average); })
	    		.style('fill', self.lineColors[person.color])
	    		.style('opacity',0);
	    
	    if(person.selected) person.select();
	}
}

LineGraph.prototype.deselectAllPeople = function deselectAllPeople() {
	var self = this;
	
	for(var i=0; i<self.people.length; i++) {
		var person = self.people[i];
		person.deselect();
	}
}

LineGraph.prototype.getPersonIndex = function getPersonIndex(id) {
	var self = this;
	
	for(var i=0; i<self.people.length; i++) {
		if( self.people[i].id === id ) return i;
	}
	
	return -1;
}

var lineGraph = new LineGraph();
