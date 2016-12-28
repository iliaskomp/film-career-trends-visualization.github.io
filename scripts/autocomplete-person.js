   
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
//     var my_autoComplete = new autoComplete({key1: value1, key2: value2});
// }


var suggestions = [];

var autocomplete = new autoComplete({
    selector: '#search-field',
    minChars: 3,
    source: function(term, response){
        var searchPersonUrl = 'search/person';
       // var query = d3.selectAll('#search-field').node().value;        
        var query = term;
        var autocompleteRequestUrl = baseUrl +  searchPersonUrl + "?api_key=" + apiKey + "&query=" + query;

        d3.json(autocompleteRequestUrl, function(json) {
            for (var i = 0; i < 5; i++) {
                suggestions.push(json.results[i].name);

            }
            console.log(suggestions);
            response(suggestions);
        });

   //     console.log("test autocomplete");
  //      console.log(suggestions);

   //     suggest(suggestions);
    }
    // renderItem: function (item, search){
    //     console.log(search);
    //     console.log(item);
    //     search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&amp;');
    //     var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
    //     return '<div class="autocomplete-suggestion" data-langname="'+item[0]+'" data-lang="'+item[1]+'" data-val="'+search+'"><img src="img/'+item[1]+'.png"> '+item[0].replace(re, "<b>$1</b>")+'</div>';
    // },
    // onSelect: function(e, term, item){
    //     console.log('Item "'+item.getAttribute('data-langname')+' ('+item.getAttribute('data-lang')+')" selected by '+(e.type == 'keydown' ? 'pressing enter' : 'mouse click')+'.');
    //     document.getElementById('advanced-demo').value = item.getAttribute('data-langname')+' ('+item.getAttribute('data-lang')+')';
    // }
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