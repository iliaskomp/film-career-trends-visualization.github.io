new autoComplete({
    selector: '#search-field',
    minChars: 3,
    source: function(term, response){
        // suggestionsWithImage = {};
        var searchPersonUrl = 'search/person';
       // var query = d3.selectAll('#search-field').node().value;        
        var query = term;
        var autocompleteRequestUrl = baseUrl +  searchPersonUrl + "?api_key=" + apiKey + "&query=" + query;

        d3.json(autocompleteRequestUrl, function(json) {
            var suggestions = [];
            var suggestionsWithImage = [];
            for (var i = 0; i < 5; i++) {
                suggestions.push(json.results[i].name);
                suggestionsWithImage.push({
                    "name": json.results[i].name,
                    "id": json.results[i].id,
                    "profile_path": json.results[i].profile_path
                });
            }            
            response(suggestionsWithImage);
        });
    },
    renderItem: function (item, search){    
        var imgPath;

        if (item.profile_path != null) {
            imgPath = 'https://image.tmdb.org/t/p/w45/' + item.profile_path;
        } else {
            imgPath = 'img/no-profile-w45.jpg';
        }

        return '<div class="autocomplete-suggestion" data-name="'+item.name+'" data-id="' + item.id + '" data-val="'+search+'"><img src="' + imgPath + '" width="20px" /><p>' + item.name + '</p></div>';
    },
    onSelect: function(e, term, item){        
        var id = item.getAttribute('data-id');
        var name = item.getAttribute('data-name');

        // var p = data[this.id];
        if(lineGraph.getPersonIndex(id) !== -1) {
            alert("Person already added!");
            return;
        }
        if(lineGraph.people.length >= 5) {
            alert("Maximum of 5 people already reached!")
            return;
        }
        var person = new Person(id, name);
        person.getFilmData();

       // console.log('Item "'+item.getAttribute('data-langname')+' ('+item.getAttribute('data-lang')+')" selected by '+(e.type == 'keydown' ? 'pressing enter' : 'mouse click')+'.');
     //   document.getElementById('advanced-demo').value = item.getAttribute('data-langname')+' ('+item.getAttribute('data-lang')+')';
    }
});






































   // d3 autocomplete my stuff

    //Variable to hold autocomplete options
// var keys;



// d3.selectAll('#search-form').on('keyup', function(){
//     d3.event.preventDefault()
//     var searchTerm = document.getElementById('search-field').value;

//     // If more than 3 letters start autocomplete
//     if (searchTerm.length >= 3) {
//         var searchPersonUrl = 'search/person';
//         var query = d3.selectAll('#search-field').node().value;        
//         var autocompleteRequestUrl = baseUrl +  searchPersonUrl + "?api_key=" + apiKey + "&query=" + query;

//        d3.json(autocompleteRequestUrl, createObjectForAutocomplete);
//     }  
// })

// function createObjectForAutocomplete(json) {
//     // console.log(json);
//     var keys = [];

//     for (var i = 0; i < 5; i++) {
//         keys.push({
//             "name": json.results[i].name,
//             "profile_path": json.results[i].profile_path
//         });

//     }
//     console.log(keys);

//     start(keys);
// }

// function start(keys) {
//         var mc = autocomplete(document.getElementById('autocompleteDiv'))
//                 .keys(keys)
//                 .dataField("name")
//                 // .placeHolder("Search Person")
//                 .width(960)
//                 .height(500)
//                 .onSelected(onSelect)
//                 .render();

// }












// d3 Autocomplete original


    //Load US States as options from CSV - but this can also be created dynamically
    // d3.csv("states.csv",function (csv) {
    //     keys=csv;
    //     console.log(keys);
    //     start();
    // });


    //Call back for when user selects an option
    // function onSelect(d) {
    //     alert(d.State);
    // }

    // //Setup and render the autocomplete
    // function start() {
    //     var mc = autocomplete(document.getElementById('test'))
    //             .keys(keys)
    //             .dataField("State")
    //             .placeHolder("Search States - Start typing here")
    //             .width(960)
    //             .height(500)
    //             .onSelected(onSelect)
    //             .render();
    // }