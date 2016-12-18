function Person (id, name) {
	this.id = id;
	this.name = name;
	this.films = [];
	this.pages = [];
	this.totalPages;
	this.graphLine = null;
	this.scatterplot = null;
	this.selected = false;
	this.listing = false;
	this.color = -1;
}

Person.prototype.getFilmData = function getFilmData () {
	var self = this;
	
    //https://api.themoviedb.org/3/discover/movie?api_key=1d9b5b41baa47611c75d9537cd59c830&sort_by=release_date.asc&page=1&with_people=1461
    var requestUrl = baseUrl + "discover/movie" + "?api_key=" + apiKey + "&sort_by=release_date.asc" + "&with_people=" + self.id;
    d3.json(requestUrl, function(json) {
    	self.processFilmData(json);
    });
}

Person.prototype.processFilmData = function processFilmData (json) {
	var self = this;
	self.saveFilmResults(json);
	self.totalPages = json.total_pages;
	
	var totalPages = json.total_pages;
    if (totalPages > 1) {
        for (var i = 2; i <= totalPages; i++) {
            var requestUrl = baseUrl + "discover/movie" + "?api_key=" + apiKey + "&sort_by=release_date.asc" + "&with_people=" + self.id + "&page=" + i;
        	d3.json(requestUrl, function(json) {
        		self.saveFilmResults(json);
        	});
        }
    }
}

Person.prototype.saveFilmResults = function saveFilmResults(json) {
	var self = this;
	
	self.pages.push(json.results);
	if(self.pages.length === self.totalPages) {
		self.addAllFilms();
	}
}

Person.prototype.addAllFilms = function addAllFilms() {
	var self = this;
	
	for(var i=0; i<self.pages.length; i++) {
		var page = self.pages[i];
	    for(var j=0; j<page.length; j++) {
	    	var obj = page[j];
	    	//only add films that have a release date or have a zero rating
	    	if(obj.release_date && obj.vote_average) {
	    		var film = new Film(
				    			obj.title,
				    			obj.id,
				    			obj.overview,
				    			obj.poster_path,
				    			obj.backdrop_path,
				    			obj.genre_ids,
				    			obj.release_date,
				    			obj.vote_average,
				    			obj.vote_count);
	    		self.films.push(film);
	    	}
	    }
    }
	
	if(self.films.length === 0) return;

	lineGraph.people.push(self);
    self.films.sort(function(a, b) {
        return parseInt(a.getYear()) - parseInt(b.getYear());
    });

    lineGraph.drawGraph();
    self.showFilmData();
    lineGraph.deselectAllPeople();
    self.select();
}

// Show all film data for the person selected
Person.prototype.showFilmData = function showFilmData() {
	var self = this;
	
	self.listing = d3.selectAll('#chosen-people').append('li');
	self.listing.append('span')
		.attr('class','person-color person-color-'+self.color)
		
	self.listing.append('span')
		.text(self.name)
		.on('click', function() {
			var personIdx = lineGraph.getPersonIndex(self.id);
			if(self.selected) {
				self.deselect();
			} else {
				lineGraph.deselectAllPeople();
				self.select();				
			}
		});
	self.listing.append('span')
		.text('x')
		.attr('class','person-remove')
		.on('click',function() {
			var personIdx = lineGraph.getPersonIndex(self.id);
			if (personIdx !== -1) {
				lineGraph.people.splice(personIdx,1);
			    lineGraph.drawGraph();
				self.listing.remove();
				return;
			}
		});
}

Person.prototype.select = function select() {
	var self = this;
		
	self.graphLine.transition().style('opacity',1).attr('stroke-width',2);
	self.scatterplot.transition().style('opacity',1);
	self.listing.attr('class','selected');
	self.selected = true;	
}

Person.prototype.deselect = function deselect() {
	var self = this;

	self.graphLine.transition().style('opacity',0.5).attr('stroke-width',1);
	self.scatterplot.transition().style('opacity',0);
	self.listing.attr('class','');
	self.selected = false;
}

Person.prototype.getAverageFilmRating = function getAverageFilmRating() {
	var self = this;
	var ratingSum = 0;
	
	for(var i=0; i<self.films.length; i++) {
		ratingSum += self.films[i].vote_average;
	}
	
	return Math.round(ratingSum / self.films.length * 100) / 100;
}

Person.prototype.getMinDate = function getMinDate () {
	return this.films[0].getReleaseDateObj();
}
Person.prototype.getMaxDate = function getMaxDate () {
	return this.films[this.films.length-1].getReleaseDateObj();
}