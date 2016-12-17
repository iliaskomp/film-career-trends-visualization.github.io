var baseUrl = "https://api.themoviedb.org/3/";
var apiKey = "1d9b5b41baa47611c75d9537cd59c830";

// When submitting the form, get persons json for query string
d3.selectAll('#search-form').on('submit', function(){
	d3.event.preventDefault()
	
	var searchPersonUrl = 'search/person';
    var query = d3.selectAll('#search-field').node().value;        
    var requestUrl = baseUrl +  searchPersonUrl + "?api_key=" + apiKey + "&query=" + query;

    d3.json(requestUrl, showPersonResults);
})


// Shows a list of persons corresponding to the search query
function showPersonResults(json) {
	var data = json.results;
    var personResults = d3.selectAll('#person-results');
    clearResultsDiv();

    for(var i=0; i<data.length; i++) {
        personResults.append('li')
        	.attr('class','person-result')
        	.attr('id', i)
        	.text(data[i].name)
        	.on('click', function() {
        		var p = data[this.id];
        		if(getPersonIndex(p.id) !== -1) {
        			alert("Person already added!");
        			return;
        		}
        		if(lineGraph.people.length >= 5) {
        			alert("Maximum of 5 people already reached!")
        			return;
        		}
        		var person = new Person(p.id, p.name);
        		person.getFilmData();
         	});
    }
}

function Person (id, name) {
	this.id = id;
	this.name = name;
	this.films = [];
	this.pages = [];
	this.totalPages;
	this.graphLine = null;
	this.selected = false;
	this.listing = false;
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

    self.showFilmData();
    lineGraph.drawGraph();
}

// Show all film data for the person selected
Person.prototype.showFilmData = function showFilmData() {
	var self = this;
	
	self.listing = d3.selectAll('#chosen-people').append('li');
	self.listing.append('span')
		.text(self.name)
		.attr('class','person-name')
		.on('click', function() {
			var personIdx = getPersonIndex(self.id);
			self.selectPerson();
		});
	//row.append('td').text(self.getAverageFilmRating());
	self.listing.append('span')
		.text('x')
		.attr('class','person-remove')
		.on('click',function() {
			var personIdx = getPersonIndex(self.id);
			if (personIdx !== -1) {
				self.removeGraphLine();
				lineGraph.people.splice(personIdx,1);
				row.remove();
				return;
			}
		});
}

Person.prototype.removeGraphLine = function removeGraphLine() {
	var self = this;
	self.graphLine.remove();
	self.graphLine = null;
}

Person.prototype.selectPerson = function highlightGraphLine() {
	var self = this;

	if(self.selected) {
		this.graphLine.transition().style('opacity',0.4);
		this.listing.attr('class','');
	}
	else {
		this.graphLine.transition().style('opacity',1);
		this.listing.attr('class','selected');
	}
	self.selected = !self.selected;
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

function getPersonIndex(id) {
	for(var i=0; i<lineGraph.people.length; i++) {
		if( lineGraph.people[i].id === id ) return i;
	}
	
	return -1;
}

function clearResultsDiv() {
	d3.selectAll('#person-results').html('');
}

function Film (title, id, overview, poster_path, backdrop_path, genre_ids, release_date, vote_average, vote_count) {
    this.title = title;
    this.id = id;
    this.overview = overview;
    this.poster_path = poster_path;
    this.backdrop_path = backdrop_path;
    this.genre_ids = genre_ids;
    this.release_date = release_date;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
}

Film.prototype.getReleaseDateObj = function getReleaseDateObj() {
	var d = new Date(this.release_date);
	return d;
}

Film.prototype.getYear = function getYear() {
	return this.release_date.substring(0,4);
}

  