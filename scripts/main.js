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

  