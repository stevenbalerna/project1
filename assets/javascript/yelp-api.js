//https://www.yelp.com/developers/documentation/v3/business_search
//http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
//https://wp-oauth.com/docs/how-to/using-a-bearer-token-with-wp-rest-api/
var name = ''
var rating = ''
var price = ''
var image = ''
$('#submitLocationBtn').on('click', function () {
    $('#yelpInfo').empty()
    event.preventDefault()
    var location = $('#cityInput').val().trim() + ', ' + $('#stateInput').children('option:selected').val()
    var restaurants = $('<div id = "restaurants"><h1>Restaurants:</h1><hr><br>')
    var bars = $('<div id = "bars"><h1>Bars:</h1><hr><br>')
    $('#restaurants').append(restaurants)
    $('#bars').append(bars)

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
            term: 'restaurants',
            location: location,
            sort_by: 'rating',
            limit: '5'
        }
    }).then(function (response) {
        for (i=0; i<response.businesses.length; i++){
            name = response.businesses[i].name
            rating = response.businesses[i].rating
            price = response.businesses[i].price
            image = response.businesses[i].image_url

            var $container = $("<div>").attr("class", "col-12 p-3");

            var $name = $("<h3>").attr("class", "").text(name);
            var $image = $("<img>").attr("class", "").attr("src", image).css("height", "200px");
            var $rating = $("<p>").attr("class", "").text("Rating: " + rating);
            var $price = $("<p>").attr("class", "").text("Price: "+ price);

            $container.append($name, $image, $rating, $price);
            restaurants.append($container)
            
        }
    })

    $.ajax({
        type: 'GET',
        url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        data: {
            term: 'bars',
            location: location,
            sort_by: 'rating',
            limit: '5'
        }
    }).then(function (response) {
        for (i=0; i<response.businesses.length; i++){
            name = response.businesses[i].name
            rating = response.businesses[i].rating
            price = response.businesses[i].price
            image = response.businesses[i].image_url
            
            var $container = $("<div>").attr("class", "p-3");

            var $name = $("<h3>").attr("class", "").text(name);
            var $image = $("<img>").attr("class", "").attr("src", image).css("height", "200px");
            var $rating = $("<p>").attr("class", "").text("Rating: " + rating);
            var $price = $("<p>").attr("class", "").text("Price: "+ price);

            $container.append($name, $image, $rating, $price);
            bars.append($container)
        }
    })
});