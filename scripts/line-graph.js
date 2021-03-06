function LineGraph() {
	this.people = [];
	this.vis = d3.select('#visualization');
	this.xRange = null;
	this.yRange = null;
	this.WIDTH = 860;
	this.HEIGHT = 500;
	this.MARGINS = {
			top: 20,
		    right: 20,
		    bottom: 20,
		    left: 50
		};
	// this.lineColors = [
	//     	'#cc0000',
	//     	'#00cc00',
	//     	'#0000cc',
	//     	'#ff8040',
	//     	'#00c0c0'
	//     ];

	this.lineColors = [
	    	'#F1595F',
	    	'#79C36A',
	    	'#599AD3',
	    	'#9E66AB',
	    	'#F9A65A'
	    	
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
	    		.style('opacity', 0.8);
	    
	    person.scatterplot = 
	    	self.vis.selectAll('.movie-dot-'+person.color)
	    		.data(person.films)
	    		.enter().append('circle')
	    		.attr('class', 'movie-dot movie-dot-'+person.color)
	    		.attr('r', 3.5)
	    		.attr('cx', function(d) { return self.xRange(d.getReleaseDateObj()); })
	    		.attr('cy', function(d) { return self.yRange(d.vote_average); })
	    		.style('fill', self.lineColors[person.color])
	    		.style('opacity',0)
	    		.on('mouseover', self.showMovieTooltip)
	    		.on('mouseout', self.hideMovieTooltip)
	    		.on('click', self.showMovieDetails);
	    
	    if(person.selected) person.select();
	}
}

LineGraph.prototype.showMovieTooltip = function showMovieTooltip(film) {	
	var divTooltip = d3.select("body").append("div")	
    	.attr("class", "tooltip")				
    	.style("opacity", 0);

    divTooltip.transition()		
        .duration(200)		
        .style("opacity", .9);		
    divTooltip.html(film.title + " (" + film.getYear() + ")")	
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
}

LineGraph.prototype.hideMovieTooltip = function hideMovieTooltip(film) {	
	var divTooltip = d3.selectAll(".tooltip");

    divTooltip.transition()		
        .duration(500)		
        .style("opacity", 0);		
}

LineGraph.prototype.showMovieDetails = function showMovieDetails(film) {
	var baseUrlForPoster = "https://image.tmdb.org/t/p/";
	var sizeForPoster = "w154";  // "w92",  "w154", "w185", "w342", "w500", "w780", "original"
	var sizeForBackdrop = "original";
	
	var posterUrl = baseUrlForPoster + sizeForPoster + film.poster_path;
	var backdropUrl = baseUrlForPoster + sizeForBackdrop + film.backdrop_path;
	var filmUrl = "https://www.themoviedb.org/movie/" + film.id; 

	d3.selectAll('#movie-details').style('display', 'block');
	d3.selectAll('#details-title').html(film.title + " (" + film.getYear() + ")")
								  .attr('href', filmUrl).attr('target','_blank');
	d3.selectAll('#details-rating').html("Rating: " +  film.vote_average);
	d3.selectAll('#details-overview').html(film.overview);
	d3.selectAll('#details-poster').attr('src', posterUrl);
	d3.selectAll('#details-genre').html(film.getGenresString());

	// Maybe todo backdrop picture 
	// d3.selectAll('body').style('background-image', "url(" + backdropUrl + ")");
	// var body = document.getElementsByTagName('body')[0];
	// body.style.opacity = "0.5";
	// body.style.filter  = 'alpha(opacity=90)'; // IE fallback
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
