$(document).ready(function (){


    $("#submitLocationBtn").on("click", function(event){

        event.preventDefault();

        var city = $("#cityInput").val().trim();
        var state = $("#stateInput").attr("data-select-state");
        getLocationInfo(city, state);
    });

    $('#stateInput').on('change', function(event) {
        var $select = $(this);
        var selectedOption = $select.children()[$select.prop('selectedIndex')];
        var stateIndexAttr = $(selectedOption).attr('data-index');
        $select.attr("data-select-state", stateIndexAttr);
    });
});


function getLocationInfo(city, state){

    var queryUrl = "https://api.census.gov/data/2014/pep/natstprc?get=STNAME,POP&DATE=7&for=state:"+state;


    console.log(state)
    console.log(queryUrl)


    $.ajax({
        url: queryUrl,
        method: 'GET'
    }).then(function (response) {
        
        var stateName = response[1][0];
        var population = response[1][1];

        $("#cityInfo").empty();

        var stateHTML = $("<p>").text("State: " + stateName);
        var popHTML = $("<p>").text("Population: "+ population);

        $("#cityInfo").append(stateHTML, popHTML);
    });

    

}