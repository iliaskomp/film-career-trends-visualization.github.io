	var baseUrl = "https://api.themoviedb.org/3/";
	var apiKey = "1d9b5b41baa47611c75d9537cd59c830";


    // When clicking the search button, get persons json for query string
	$("#search-button").on("click", function(){
		var searchPersonUrl = "search/person";
        var query = $("#search-field").val();        
        var requestUrl = baseUrl +  searchPersonUrl + "?api_key=" + apiKey + "&query=" + query;

        $.getJSON(requestUrl, function(json, textStatus) {
                showPersonResults(json.results);
        });        
	})


    // Shows a list of persons corresponding to the search query
    function showPersonResults(data) {
        var personResults = $("#person-results");
        // personResults.empty();
        clearResultsDiv();
        console.log(data);
    
        $.each(data, function(index, obj) {
             personResults.append('<a href="#" class="person-result" id="' + index + '">' + obj.name + '</a>');
        });

        $(".person-result").on('click', function() {            
            var htmlId = $(this).attr('id');
            var personId = data[htmlId].id;
            
            getFilmDataForPerson(personId);
        });
    }

    // Get all films for the person selected
    function getFilmDataForPerson(id) {
         //https://api.themoviedb.org/3/discover/movie?api_key=1d9b5b41baa47611c75d9537cd59c830&sort_by=release_date.asc&page=1&with_people=1461
        var requestUrl = baseUrl + "discover/movie" + "?api_key=" + apiKey + "&sort_by=release_date.asc" + "&with_people=" + id;
        var personFilmData = [];
        
        $.getJSON(requestUrl, function(json, textStatus) {
           
            console.log(json);
            var totalPages = json.total_pages;

            //var personFilmData = createArrayOfFilmObjects(json.results);  
            
            $.each(json.results, function(index, obj) {
                var film = new Film(obj.title, obj.id, obj.overview, obj.poster_path, obj.backdrop_path, obj.genre_ids, obj.release_date, obj.vote_average, obj.vote_count);
                personFilmData.push(film);
            });
            // Not working showing!
            if (totalPages > 1) {
                for (var i = 2; i < totalPages; i++) {
                    requestUrl = baseUrl + "discover/movie" + "?api_key=" + apiKey + "&sort_by=release_date.asc" + "&with_people=" + id + "&page=" + i;
                    $.getJSON(requestUrl, function(json, textStatus) {
                        console.log(json);
                        $.each(json.results, function(index, obj) {
                            var film = new Film(obj.title, obj.id, obj.overview, obj.poster_path, obj.backdrop_path, obj.genre_ids, obj.release_date, obj.vote_average, obj.vote_count);
                            personFilmData.push(film);
                        });
                    });
                };
            }
        
      

            clearResultsDiv();
            showFilmDataForPersonSelected(personFilmData);
            console.log("personFilmData");
            console.log(personFilmData);


        });
    }
    // Create an array of film objects for the person chosen
    function createArrayOfFilmObjects(data) {
        var personFilmData = [];



        return personFilmData;
    }

    // Show all film data for the person selected
    function showFilmDataForPersonSelected(data) {
        $.each(data, function(index, obj) {
            var filmDiv = "<p class='film-info'>" + obj.title + " (" + obj.getYear() + ")  " + "Rating: " + obj.vote_average + "</p>";
            $("#person-film-results").append(filmDiv);
        });
        console.log(data);
    }





    function clearResultsDiv() {
        $("#person-results").empty();
        $("#person-film-results").empty();
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
        this.getYear = function() {
            return release_date.substring(0, 4);
        }
    }

  