$(document).ready(function () {


    getLocationInfo("Charlotte", "North Carolina", "Charlotte, NC");
    

    $("#submitLocationBtn").on("click", function (event) {
        event.preventDefault();

        var city = $("#cityInput").val().trim();
        var state = $("#stateInput").attr("data-select-state");
        var location = city + ', ' + $('#stateInput').children('option:selected').val();
        getLocationInfo(city, state, location);
        
    });

    $('#stateInput').on('change', function (event) {
        var $select = $(this);
        var selectedOption = $select.children()[$select.prop('selectedIndex')];
        var stateName = $(selectedOption).text() ? $(selectedOption).text().split(" (")[0] : undefined;
        $select.attr("data-select-state", stateName);
    });

});

function getLocationInfo(city, state, location) {

    clearCardsOnPage("Statistics");
    clearCardsOnPage("Entertainment");



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

        getCityData(link, location);
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

function getCityData(link, location) {

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

        if (response._links.hasOwnProperty("city:urban_area")) {
            $.ajax({
                url: response._links["city:urban_area"].href + "scores",
                method: 'GET'
            }).then(function (response) {

                response.categories.forEach(scoreElement => {
                    cityInfo.scoreNames.push(scoreElement.name);
                    var score = Math.round(parseFloat((scoreElement["score_out_of_10"] / 2).toFixed(1)) / .5) * .5;
                    cityInfo.scores.push(score);
                });

                addCardToPage(createCard("Statistics", createStatsHTML(cityInfo)), "Statistics", "show");

            });

        } else {

            addCardToPage(createCard("Statistics", createStatsHTML(cityInfo)), "Statistics", "show");
        }
        getEntertainmentSections(location);
    });
}

function getTopFiveOf(term, location) {
    var apiKey = 'gYpd0tg2LukWlDSHSOD5LgGSwODx7DSxL4tNAKDW0Hmo3isXWutgLbtpboiWy76e79vrCD02K9yc1Gfm5VMOc2XmDoyloCiaWVRg2PGbksm9ByMzEjTrbPS5CQv3XHYx'
    $.ajax({
        type: 'GET',
        url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        data: {
            term: term,
            location: location,
            sort_by: 'rating',
            limit: '5'
        }
    }).then(function (response) {
        
        console.log(response);

        addCardToPage(createCard(term, createEntertainmentHTML(response.businesses)), "Entertainment", "hide");

    })

}

function getEntertainmentSections(location) {
    getTopFiveOf("Restaurants", location);
    getTopFiveOf("Bars", location);
    getTopFiveOf("Hotels", location)
    getTopFiveOf("Casinos", location)
    getTopFiveOf("Museums", location)
}


function createStatsHTML(cityInfo) {

    var $container = $("<div>").attr("class", "container");
    var $row = $("<div>").attr("class", "row").appendTo($container);
    var $cityName = $("<h1>").attr("class", "col-12 mt-3 mb-3 text-center").text(cityInfo.cityName).appendTo($row);
    var $cityPopulation = $("<h5>").attr("class", "col-12 text-center pb-4 mb-3 border-bottom border-secondary").text("Population: " + cityInfo.cityPopulation).appendTo($row);

    cityInfo.scoreNames.forEach(name => {

        var $col = $("<div>").attr("class", "col-12 col-md-3 mb-2 text-center");
        var scoreName = $("<h5>").text(name).appendTo($col);
        var $score = getStars(cityInfo.scores[cityInfo.scoreNames.indexOf(name)]);

        scoreName.append($score);
        $row.append($col)
    });

    return $container;
}

function createEntertainmentHTML(businesses) {
    var $container = $("<div>").attr("class", "container");
    var $row = $("<div>").attr("class", "row text-center").appendTo($container);

    businesses.forEach(business => {
        var name = business.name
        var rating = business.rating;
        var image = business.image_url
        var $newDiv = $("<div>").attr("class", "col-6 pb-3");
        var $name = $("<h5>").attr("class", "").text(name).appendTo($newDiv);
        var $link = $("<a>").attr("target", "_blank").attr("href", business.url).appendTo($newDiv);
        var $image = $("<img>").attr("class", "").attr("src", image).css("height", "200px").appendTo($link);

        var $rating = getStars(rating).appendTo($newDiv);

        if(business.price){
            getDollars(business.price.length).appendTo($newDiv);
        } 

        $row.append($newDiv);
    });



    return $container;
}

function createCard(title, $content) {
    var $card = $("<div>").attr("class", "card");
    var $header = $("<div>").attr("class", "card-header text-center pb-2 text-white color_blue").on("click", function () {

        if ($(this).siblings(".card-body").is(":hidden")) {
            $(this).siblings(".card-body").slideDown();
        } else {
            $(this).siblings(".card-body").slideUp();
        }

    });
    var $body = $("<div>").attr("class", "card-body");
    var $title = $("<h4>").text(title);

    $header.append($title);
    $body.append($content)
    $card.append($header, $body);

    return $card;
}

function addCardToPage($card, sectionType, display = "hide") {
    var $row = $("<div>").attr("class", "row section" + sectionType);
    var $col = $("<div>").attr("class", "col-12 pb-3");

    if (display === "hide") {
        $card.children(".card-body").hide();
    }

    $col.append($card);
    $row.append($col);

    $("#pageContent").append($row);
}

function clearCardsOnPage(type) {
    $(".section" + type).remove();
}

function getStars(rating){

    var $container = $("<div>").attr("class", "stars");
    
    var fullStars = Math.floor(rating);
    var addHalfStar = (rating - fullStars > 0);
    var emptyStars = (addHalfStar ? 5 - fullStars - 1 : 5 - fullStars);


    for (let i = 0; i < fullStars; i++) {
        $container.append($("<img>").attr("src", "assets/images/empty.png").attr("class", "full_star"))
    }

    if(addHalfStar) $container.append($("<img>").attr("src", "assets/images/empty.png").attr("class", "half_star"))

    for (let i = 0; i < emptyStars; i++) {
        $container.append($("<img>").attr("src", "assets/images/empty.png").attr("class", "no_star")) 
    }

    return $container;
}

function getDollars(price){

    var $container = $("<div>").attr("class", "dollars");

    for (let i = 0; i < price; i++) {
        $container.append($("<img>").attr("src", "assets/images/dollarIcon.png"))
    }

    return $container;
}