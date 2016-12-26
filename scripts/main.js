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
        		if(lineGraph.getPersonIndex(p.id) !== -1) {
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

Film.prototype.getGenres = function getGenres() {
    var self = this;

    var genresArray = [];

    for (var i = 0; i < self.genre_ids.length; i++ ) {    
        for (var j = 0; j < genres.genres.length; j++) {
            if (self.genre_ids[i] == genres.genres[j].id) {
                genresArray.push(genres.genres[j].name);        
            }
        }
    }

    return genresArray;
}

Film.prototype.getGenresString = function getGenresString() {
    var self = this;

    var genresArray = self.getGenres();
    var genresString = "";
    for (var i = 0; i < genresArray.length; i++) {
        genresString += genresArray[i] + ", ";

    }
    genresString = genresString.slice(0,  -2);
    return genresString;
}


var genres = {"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]};