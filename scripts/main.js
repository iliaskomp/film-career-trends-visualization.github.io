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
    // personResults.empty();
    clearResultsDiv();
    console.log(data);

    for(var i=0; i<data.length; i++) {
    	var id = i;
        personResults.append('a')
        	.attr('class','person-result')
        	.attr('id', id)
        	.text(data[i].name)
        	.on('click', function() {
        		getFilmDataForPerson(data[this.id].id);
         	});
    }
}

// Get all films for the person selected
function getFilmDataForPerson(id) {
     //https://api.themoviedb.org/3/discover/movie?api_key=1d9b5b41baa47611c75d9537cd59c830&sort_by=release_date.asc&page=1&with_people=1461
    var requestUrl = baseUrl + "discover/movie" + "?api_key=" + apiKey + "&sort_by=release_date.asc" + "&with_people=" + id;
    d3.json(requestUrl, function(json){showFilmResults(json,id);});
}

function showFilmResults(json, id) {
    var totalPages = json.total_pages;
    var personFilmData = [];
    
    for(var i=0; i<json.results.length; i++) {
    	var obj = json.results[i];
        var film = new Film(obj.title, obj.id, obj.overview, obj.poster_path, obj.backdrop_path, obj.genre_ids, obj.release_date, obj.vote_average, obj.vote_count);
        personFilmData.push(film);
    };
    
    // Not working showing!
    if (totalPages > 1) {
        for (var i = 2; i < totalPages; i++) {
            var requestUrl = baseUrl + "discover/movie" + "?api_key=" + apiKey + "&sort_by=release_date.asc" + "&with_people=" + id + "&page=" + i;
        	d3.json(requestUrl, function(json){
                console.log(json);
                for(var j=0; j<json.results.length; j++) {
                	var obj = json.results[i];
                    var film = new Film(obj.title, obj.id, obj.overview, obj.poster_path, obj.backdrop_path, obj.genre_ids, obj.release_date, obj.vote_average, obj.vote_count);
                    personFilmData.push(film);
                }
            });
        }
    }

    clearResultsDiv();
    showFilmDataForPersonSelected(personFilmData);
    console.log("personFilmData");
    console.log(personFilmData);
}

// Create an array of film objects for the person chosen
function createArrayOfFilmObjects(data) {
    var personFilmData = [];



    return personFilmData;
}

// Show all film data for the person selected
function showFilmDataForPersonSelected(data) {
	for(var i=0; i<data.length; i++) {
		var obj = data[i];
        d3.selectAll('#person-film-results')
        	.append('p')
        	.attr('class','film-info')
        	.text(obj.title + " (" + obj.getYear() + ")  " + "Rating: " + obj.vote_average);
    }
    console.log(data);
}

function clearResultsDiv() {
	d3.selectAll('#person-results').html('');
	d3.selectAll('#person-film-results').html('');
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

Film.prototype.getYear = function() {
	return this.release_date.substring(0,4);
}

  