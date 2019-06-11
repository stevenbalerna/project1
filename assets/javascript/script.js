$(document).ready(function () {


    $("#submitLocationBtn").on("click", function (event) {

        event.preventDefault();

        var city = $("#cityInput").val().trim();
        var state = $("#stateInput").attr("data-select-state");

        


        console.log(city)
        console.log(state)
        getLocationInfo(city, state);
    });

    $('#stateInput').on('change', function (event) {
        var $select = $(this);
        var selectedOption = $select.children()[$select.prop('selectedIndex')];
        var stateName = $(selectedOption).text() ? $(selectedOption).text().split(" (")[0] : undefined;
        $select.attr("data-select-state", stateName);
    });


});

function getLocationInfo(city, state) {
    var queryUrl = "https://api.teleport.org/api/cities/?search=" + city;

    $.ajax({
        url: queryUrl,
        method: 'GET'
    }).then(function (response) {
        var link;
        var results = response._embedded["city:search-results"]

        results.forEach(result => {
            var name = result.matching_full_name;
            if (isGoodResult(name, city, state)) {
                link = result._links["city:item"].href;
                return;
            }
        });

        getCityData(link);
    });

}

function formatLocation(location) {
    location = location.toLowerCase();
    location = location.replace(".", "");
    return location;
}

function isGoodResult(searchResultName, city, state) {
    var searchResult;
    searchResultName = formatLocation(searchResultName);
    searchResult = searchResultName.split(",");
    return searchResult[0].trim() === formatLocation(city) && searchResult[1].trim() === state.toLowerCase() && searchResult[2].includes("united states");
}

function getCityData(link){
   
    var cityInfo = {
        cityName: "",
        cityPopulation: 0,
        scoreNames: [],
        scores: []
    }

    $.ajax({
        url: link,
        method: 'GET'
    }).then(function (response) {
        cityInfo.cityName = response.full_name.split(",")[0] + ", " + response.full_name.split(",")[1];
        cityInfo.cityPopulation = response.population;

        if(response._links.hasOwnProperty("city:urban_area")){
            $.ajax({
                url: response._links["city:urban_area"].href+"scores",
                method: 'GET'
            }).then(function (response) {
               
                response.categories.forEach(scoreElement => {
                    cityInfo.scoreNames.push(scoreElement.name);
                    var score = Math.round(parseFloat((scoreElement["score_out_of_10"]/2).toFixed(1)) / .5) * .5; 
                    cityInfo.scores.push(score);
                });
                console.log(cityInfo)
                displayCityInfo(cityInfo);
                
            });
            
        }else{
            console.log(cityInfo)
            displayCityInfo(cityInfo)
        }

    });
}

function displayCityInfo(cityInfo){
    $("#cityInfo").empty();

    var $container = $("<div>").attr("class", "row")
    var $cityName = $("<h1>").attr("class", "col-12 mt-3 mb-3 text-center").text(cityInfo.cityName).appendTo($container);
    var $cityPopulation = $("<h5>").attr("class", "col-12 text-center pb-4 mb-3 border-bottom border-secondary").text("Population: " + cityInfo.cityPopulation).appendTo($container);

    cityInfo.scoreNames.forEach(name => {

        var scoreName = $("<h5>").attr("class", "col-6 col-md-3").text(name);
        var score =  $("<h5>").attr("class", "col-6 col-md-3").text(cityInfo.scores[cityInfo.scoreNames.indexOf(name)]);
        $container.append(scoreName, score)
    });

    $("#cityInfo").append($container);
}