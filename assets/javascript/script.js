$(document).ready(function (){


    $("#submitLocationBtn").on("click", function(event){

        event.preventDefault();

        var city = $("#cityInput").val().trim();
        var state = $("#stateInput").prop("selectedIndex");
        console.log(state)

        console.log(city,state)

        getLocationInfo(city, state);
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
        console.log(response)



    });

}